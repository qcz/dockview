import { DockviewApi } from '../api/component.api';
import { Direction } from '../gridview/baseComponentGridview';
import { IGridView } from '../gridview/gridview';
import {
    IContentRenderer,
    ITabRenderer,
    WatermarkConstructor,
    IWatermarkRenderer,
} from './types';
import { Parameters } from '../panel/types';
import { DockviewGroupPanel } from './dockviewGroupPanel';
import { PanelTransfer } from '../dnd/dataTransfer';
import { IDisposable } from '../lifecycle';
import { DroptargetOverlayModel, Position } from '../dnd/droptarget';
import {
    DockviewGroupDropLocation,
    GroupOptions,
} from './dockviewGroupPanelModel';
import { IDockviewPanel } from './dockviewPanel';
import {
    ComponentConstructor,
    FrameworkFactory,
} from '../panel/componentFactory';
import { DockviewPanelRenderer } from '../overlayRenderContainer';
import { IGroupHeaderProps } from './framework';

export interface IHeaderActionsRenderer extends IDisposable {
    readonly element: HTMLElement;
    init(params: IGroupHeaderProps): void;
}

export interface GroupPanelFrameworkComponentFactory {
    content: FrameworkFactory<IContentRenderer>;
    tab: FrameworkFactory<ITabRenderer>;
    watermark: FrameworkFactory<IWatermarkRenderer>;
}

export interface TabContextMenuEvent {
    event: MouseEvent;
    api: DockviewApi;
    panel: IDockviewPanel;
}

export interface ViewFactoryData {
    content: string;
    tab?: string;
}

export interface DockviewOptions {
    disableAutoResizing?: boolean;
    hideBorders?: boolean;
    singleTabMode?: 'fullwidth' | 'default';
    disableFloatingGroups?: boolean;
    floatingGroupBounds?:
        | 'boundedWithinViewport'
        | {
              minimumHeightWithinViewport?: number;
              minimumWidthWithinViewport?: number;
          };
    popoutUrl?: string;
    defaultRenderer?: DockviewPanelRenderer;
    debug?: boolean;
    rootOverlayModel?: DroptargetOverlayModel;
    locked?: boolean;
    disableDnd?: boolean;
}

export interface DockviewDndOverlayEvent {
    nativeEvent: DragEvent;
    target: DockviewGroupDropLocation;
    position: Position;
    group?: DockviewGroupPanel;
    getData: () => PanelTransfer | undefined;
    //
    isAccepted: boolean;
    accept(): void;
}

export class DockviewUnhandledDragOverEvent implements DockviewDndOverlayEvent {
    private _isAccepted = false;

    get isAccepted(): boolean {
        return this._isAccepted;
    }

    constructor(
        readonly nativeEvent: DragEvent,
        readonly target: DockviewGroupDropLocation,
        readonly position: Position,
        readonly getData: () => PanelTransfer | undefined,
        readonly group?: DockviewGroupPanel
    ) {}

    accept(): void {
        this._isAccepted = true;
    }
}

export const PROPERTY_KEYS: (keyof DockviewOptions)[] = (() => {
    /**
     * by readong the keys from an empty value object TypeScript will error
     * when we add or remove new properties to `DockviewOptions`
     */
    const properties: Record<keyof DockviewOptions, undefined> = {
        disableAutoResizing: undefined,
        hideBorders: undefined,
        singleTabMode: undefined,
        disableFloatingGroups: undefined,
        floatingGroupBounds: undefined,
        popoutUrl: undefined,
        defaultRenderer: undefined,
        debug: undefined,
        rootOverlayModel: undefined,
        locked: undefined,
        disableDnd: undefined,
    };

    return Object.keys(properties) as (keyof DockviewOptions)[];
})();

export interface DockviewFrameworkOptions {
    headerRightActionComponent?: (
        group: DockviewGroupPanel
    ) => IHeaderActionsRenderer;
    headerLeftActionComponent?: (
        group: DockviewGroupPanel
    ) => IHeaderActionsRenderer;
    headerPrefixActionComponent?: (
        group: DockviewGroupPanel
    ) => IHeaderActionsRenderer;
    tabComponents?: {
        [componentName: string]: ComponentConstructor<ITabRenderer>;
    };
    components?: {
        [componentName: string]: ComponentConstructor<IContentRenderer>;
    };
    frameworkTabComponents?: {
        [componentName: string]: any;
    };
    frameworkComponents?: {
        [componentName: string]: any;
    };
    parentElement: HTMLElement;
    defaultTabComponent?: string;
    watermarkComponent?: WatermarkConstructor;
    watermarkFrameworkComponent?: any;
    frameworkComponentFactory?: GroupPanelFrameworkComponentFactory;
}

export type DockviewComponentOptions = DockviewOptions &
    DockviewFrameworkOptions;

export interface PanelOptions<P extends object = Parameters> {
    component: string;
    tabComponent?: string;
    params?: P;
    id: string;
    title?: string;
}

type RelativePanel = {
    direction?: Direction;
    referencePanel: string | IDockviewPanel;
};

type RelativeGroup = {
    direction?: Direction;
    referenceGroup: string | DockviewGroupPanel;
};

type AbsolutePosition = {
    direction: Omit<Direction, 'within'>;
};

export type AddPanelPositionOptions =
    | RelativePanel
    | RelativeGroup
    | AbsolutePosition;

export function isPanelOptionsWithPanel(
    data: AddPanelPositionOptions
): data is RelativePanel {
    if ((data as RelativePanel).referencePanel) {
        return true;
    }
    return false;
}

export function isPanelOptionsWithGroup(
    data: AddPanelPositionOptions
): data is RelativeGroup {
    if ((data as RelativeGroup).referenceGroup) {
        return true;
    }
    return false;
}

type AddPanelFloatingGroupUnion = {
    floating:
        | {
              height?: number;
              width?: number;
              x?: number;
              y?: number;
          }
        | true;
    position: never;
};

type AddPanelPositionUnion = {
    floating: false | never;
    position: AddPanelPositionOptions;
};

type AddPanelOptionsUnion = AddPanelFloatingGroupUnion | AddPanelPositionUnion;

export type AddPanelOptions<P extends object = Parameters> = {
    params?: P;
    id: string;
    title?: string;
    component: string;
    tabComponent?: string;
    renderer?: DockviewPanelRenderer;
} & Partial<AddPanelOptionsUnion>;

type AddGroupOptionsWithPanel = {
    referencePanel: string | IDockviewPanel;
    direction?: Omit<Direction, 'within'>;
};

type AddGroupOptionsWithGroup = {
    referenceGroup: string | DockviewGroupPanel;
    direction?: Omit<Direction, 'within'>;
};

export type AddGroupOptions = (
    | AddGroupOptionsWithGroup
    | AddGroupOptionsWithPanel
    | AbsolutePosition
) &
    GroupOptions;

export function isGroupOptionsWithPanel(
    data: AddGroupOptions
): data is AddGroupOptionsWithPanel {
    if ((data as AddGroupOptionsWithPanel).referencePanel) {
        return true;
    }
    return false;
}

export function isGroupOptionsWithGroup(
    data: AddGroupOptions
): data is AddGroupOptionsWithGroup {
    if ((data as AddGroupOptionsWithGroup).referenceGroup) {
        return true;
    }
    return false;
}

export interface MovementOptions2 {
    group?: IGridView;
}

export interface MovementOptions extends MovementOptions2 {
    includePanel?: boolean;
    group?: DockviewGroupPanel;
}
