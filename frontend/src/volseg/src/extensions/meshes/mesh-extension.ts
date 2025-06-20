/**
 * Copyright (c) 2018-2024 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Adam Midlik <midlik@gmail.com>
 * @author Aliaksei Chareshneu <chareshneu.tech@gmail.com>
 */

/** Defines new types of State tree transformers for dealing with mesh data. */

import {
  BaseGeometry,
  VisualQuality,
  VisualQualityOptions,
} from "molstar/lib/commonjs/mol-geo/geometry/base";
import { Mesh } from "molstar/lib/commonjs/mol-geo/geometry/mesh/mesh";
import { CifFile } from "molstar/lib/commonjs/mol-io/reader/cif";
import { Box3D } from "molstar/lib/commonjs/mol-math/geometry";
import { Vec3 } from "molstar/lib/commonjs/mol-math/linear-algebra";
import { Shape } from "molstar/lib/commonjs/mol-model/shape";
import { ShapeProvider } from "molstar/lib/commonjs/mol-model/shape/provider";
import { PluginStateObject } from "molstar/lib/commonjs/mol-plugin-state/objects";
import { StateTransforms } from "molstar/lib/commonjs/mol-plugin-state/transforms";
import { Download } from "molstar/lib/commonjs/mol-plugin-state/transforms/data";
import { ShapeRepresentation3D } from "molstar/lib/commonjs/mol-plugin-state/transforms/representation";
import { PluginContext } from "molstar/lib/commonjs/mol-plugin/context";
import {
  StateObjectRef,
  StateObjectSelector,
  StateTransformer,
} from "molstar/lib/commonjs/mol-state";
import { Task } from "molstar/lib/commonjs/mol-task";
import { Color } from "molstar/lib/commonjs/mol-util/color";
import { ParamDefinition as PD } from "molstar/lib/commonjs/mol-util/param-definition";
import * as MeshUtils from "./mesh-utils";

export const BACKGROUND_SEGMENT_VOLUME_THRESHOLD = 0.5;
export const BACKGROUND_OPACITY = 0.2;
export const FOREROUND_OPACITY = 1;

export const VolsegTransform: StateTransformer.Builder.Root =
  StateTransformer.builderFactory("volseg-v2");

// // // // // // // // // // // // // // // // // // // // // // // //
// Parsed data

export const isMeshlistData = (value: MeshlistData): value is MeshlistData =>
  !!value?.detail;

/** Data type for `MeshlistStateObject` - list of meshes */
export interface MeshlistData {
  segmentId: number;
  segmentName: string;
  detail: number;
  meshIds: number[];
  mesh: Mesh;
  /** Reference to the object which created this meshlist (e.g. `MeshStreaming.Behavior`) */
  ownerId?: string;
  segmentationId?: string;
}

export namespace MeshlistData {
  export function empty(): MeshlistData {
    return {
      segmentId: 0,
      segmentName: "Empty",
      detail: 0,
      meshIds: [],
      mesh: Mesh.createEmpty(),
    };
  }
  export async function fromCIF(
    data: CifFile,
    segmentId: number,
    segmentName: string,
    detail: number,
  ): Promise<MeshlistData> {
    const { mesh, meshIds } = await MeshUtils.meshFromCif(data);
    return {
      segmentId,
      segmentName,
      detail,
      meshIds,
      mesh,
    };
  }
  export function stats(meshListData: MeshlistData): string {
    return `Meshlist "${meshListData.segmentName}" (detail ${meshListData.detail}): ${meshListData.meshIds.length} meshes, ${meshListData.mesh.vertexCount} vertices, ${meshListData.mesh.triangleCount} triangles`;
  }
  export function getShape(data: MeshlistData, color: Color): Shape<Mesh> {
    const mesh = data.mesh;
    const meshShape: Shape<Mesh> = Shape.create(
      data.segmentName,
      data,
      mesh,
      () => color,
      () => 1,
      // group => `${data.segmentName} | Segment ${data.segmentId} | Detail ${data.detail} | Mesh ${group}`,
      (group) => data.segmentName,
    );
    return meshShape;
  }

  export function combineBBoxes(boxes: (Box3D | null)[]): Box3D | null {
    let result = null;
    for (const box of boxes) {
      if (!box) continue;
      if (result) {
        Vec3.min(result.min, result.min, box.min);
        Vec3.max(result.max, result.max, box.max);
      } else {
        result = Box3D.zero();
        Box3D.copy(result, box);
      }
    }
    return result;
  }
  export function bbox(data: MeshlistData): Box3D | null {
    return MeshUtils.bbox(data.mesh);
  }

  export function allVerticesUsed(data: MeshlistData): boolean {
    const unusedVertices = new Set();
    for (let i = 0; i < data.mesh.vertexCount; i++) {
      unusedVertices.add(i);
    }
    for (let i = 0; i < 3 * data.mesh.triangleCount; i++) {
      const v = data.mesh.vertexBuffer.ref.value[i];
      unusedVertices.delete(v);
    }
    return unusedVertices.size === 0;
  }
}

// // // // // // // // // // // // // // // // // // // // // // // //
// Raw Data -> Parsed data

export class MeshlistStateObject extends PluginStateObject.Create<MeshlistData>(
  { name: "Parsed Meshlist", typeClass: "Object" },
) {}

export const ParseMeshlistTransformer = VolsegTransform({
  name: "new-meshlist-from-string",
  from: PluginStateObject.Format.Cif,
  to: MeshlistStateObject,
  params: {
    label: PD.Text(MeshlistStateObject.type.name, { isHidden: true }),
    segmentId: PD.Numeric(1, {}, { isHidden: true }),
    segmentName: PD.Text("Segment"),
    detail: PD.Numeric(1, {}, { isHidden: true }),
    /** Reference to the object which manages this meshlist (e.g. `MeshStreaming.Behavior`) */
    ownerId: PD.Text("", { isHidden: true }),
  },
})({
  apply({ a, params }, globalCtx) {
    // `a` is the parent node, params are 2nd argument to To.apply(), `globalCtx` is the plugin
    return Task.create("Create Parsed Meshlist", async (ctx) => {
      const meshlistData = await MeshlistData.fromCIF(
        a.data,
        params.segmentId,
        params.segmentName,
        params.detail,
      );
      meshlistData.ownerId = params.ownerId;
      const es = meshlistData.meshIds.length === 1 ? "" : "es";
      return new MeshlistStateObject(meshlistData, {
        label: params.label,
        description: `${meshlistData.segmentName} (${meshlistData.meshIds.length} mesh${es})`,
      });
    });
  },
});

// // // // // // // // // // // // // // // // // // // // // // // //
// Parsed data -> Shape

/** Data type for PluginStateObject.Shape.Provider */
type MeshShapeProvider = ShapeProvider<MeshlistData, Mesh, Mesh.Params>;
namespace MeshShapeProvider {
  export function fromMeshlistData(
    meshlist: MeshlistData,
    color?: Color,
  ): MeshShapeProvider {
    const theColor = color ?? MeshUtils.ColorGenerator.next().value;
    return {
      label: "Mesh",
      data: meshlist,
      params: meshShapeProviderParams,
      geometryUtils: Mesh.Utils,
      getShape: (ctx, data: MeshlistData) =>
        MeshlistData.getShape(data, theColor),
    };
  }
}

const meshShapeProviderParams: Mesh.Params = {
  ...Mesh.Params,
  quality: PD.Select<VisualQuality>("custom", VisualQualityOptions, {
    isEssential: true,
    description: "Visual/rendering quality of the representation.",
  }), // use 'custom' when wanting to apply doubleSided
  doubleSided: PD.Boolean(true, BaseGeometry.CustomQualityParamInfo),
  // set `flatShaded`: true to see the real mesh vertices and triangles
  transparentBackfaces: PD.Select(
    "on",
    PD.arrayToOptions(["off", "on", "opaque"] as const),
    BaseGeometry.ShadingCategory,
  ), // 'on' means: show backfaces with correct opacity, even when opacity < 1 (requires doubleSided) ¯\_(ツ)_/¯
};

export const MeshShapeTransformer = VolsegTransform({
  name: "new-shape-from-meshlist",
  display: {
    name: "Shape from Meshlist",
    description: "Create Shape from Meshlist data",
  },
  from: MeshlistStateObject,
  to: PluginStateObject.Shape.Provider,
  params: {
    color: PD.Value<Color | undefined>(undefined), // undefined means random color
  },
})({
  apply({ a, params }) {
    const shapeProvider = MeshShapeProvider.fromMeshlistData(
      a.data,
      params.color,
    );
    return new PluginStateObject.Shape.Provider(shapeProvider, {
      label: PluginStateObject.Shape.Provider.type.name,
      description: a.description,
    });
  },
});

const meshSegmentParams = {
  id: PD.Numeric(0),
  label: PD.Text(""),
  color: PD.Color(Color(0x121212)),
  detail: PD.Numeric(1),
};

export type meshSegmentParamsValues = PD.Values<typeof meshSegmentParams>;

export const VolsegMeshDataParams = {
  meshSegmentParams: PD.ObjectList(meshSegmentParams, (s) => s.id.toString()),
};
export type VolsegMeshDataParamsValues = PD.Values<typeof VolsegMeshDataParams>;

export type MeshData = {
  meshSegmentParams: meshSegmentParamsValues;
  parsedCif: CifFile;
};

export class VolsegMeshData {
  constructor(public meshData: MeshData[]) {}
}

export class VolsegMeshSegmentation extends PluginStateObject.Create<VolsegMeshData>(
  { name: "Vol & Seg Mesh Segmentation", typeClass: "Data" },
) {}

export const CreateMeshlistStateObject = VolsegTransform({
  name: "create-meshlist-from-mesh-segmentation",
  from: VolsegMeshSegmentation,
  // from: PluginStateObject.Root,
  to: MeshlistStateObject,
  params: {
    segmentId: PD.Numeric(1, {}, { isHidden: true }),
    // add ownerId
    ownerId: PD.Text(""),
    segmentationId: PD.Text("0"),
  },
})({
  apply({ a, params, spine }, globalCtx) {
    // `a` is the parent node, params are 2nd argument to To.apply(), `globalCtx` is the plugin
    return Task.create("Create Parsed Meshlist", async (ctx) => {
      // const entry = spine.getAncestorOfType(VolsegEntry);
      const segmentId = params.segmentId;
      const segmentData = a.data.meshData.find(
        (m) => m.meshSegmentParams.id === segmentId,
      );
      if (!segmentData) throw Error("no segment data found");
      const cif = segmentData.parsedCif;
      const { detail, label } = segmentData.meshSegmentParams;
      const meshlistData = await MeshlistData.fromCIF(
        cif,
        params.segmentId,
        label,
        detail,
      );
      meshlistData.ownerId = params.ownerId;
      meshlistData.segmentationId = params.segmentationId;
      const es = meshlistData.meshIds.length === 1 ? "" : "es";
      const cleanText = label.replace(/<\/?[^>]+(>|$)/g, "");
      return new MeshlistStateObject(meshlistData, {
        label: cleanText,
        description: `${cleanText} (${meshlistData.meshIds.length} mesh${es})`,
      });
    });
  },
});

// // // // // // // // // // // // // // // // // // // // // // // //

/** Download data and create state tree hierarchy down to visual representation. */
export async function createMeshFromUrl(
  plugin: PluginContext,
  meshDataUrl: string,
  segmentId: number,
  detail: number,
  collapseTree: boolean,
  color?: Color,
  parent?: StateObjectSelector | StateObjectRef,
  transparentIfBboxAbove?: number,
  name?: string,
  ownerId?: string,
) {
  const update = parent ? plugin.build().to(parent) : plugin.build().toRoot();
  const rawDataNodeRef = update.apply(
    Download,
    { url: meshDataUrl, isBinary: true, label: `Downloaded Data ${segmentId}` },
    { state: { isCollapsed: collapseTree } },
  ).ref;
  const parsedDataNode = await update
    .to(rawDataNodeRef)
    .apply(StateTransforms.Data.ParseCif)
    .apply(
      ParseMeshlistTransformer,
      {
        label: undefined,
        segmentId: segmentId,
        segmentName: name ?? `Segment ${segmentId}`,
        detail: detail,
        ownerId: ownerId,
      },
      {},
    )
    .commit();

  let transparent = false;
  if (transparentIfBboxAbove !== undefined && parsedDataNode.data) {
    const bbox = MeshlistData.bbox(parsedDataNode.data) || Box3D.zero();
    transparent = Box3D.volume(bbox) > transparentIfBboxAbove;
  }

  await plugin
    .build()
    .to(parsedDataNode)
    .apply(MeshShapeTransformer, { color: color })
    .apply(
      ShapeRepresentation3D,
      { alpha: transparent ? BACKGROUND_OPACITY : FOREROUND_OPACITY },
      { tags: ["mesh-segment-visual", `segment-${segmentId}`] },
    )
    .commit();

  return rawDataNodeRef;
}
