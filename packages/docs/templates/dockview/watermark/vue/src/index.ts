import 'dockview-core/dist/styles/dockview.css';
import { PropType, createApp, defineComponent } from 'vue';
import { DockviewVue } from 'dockview-vue';
import {
    DockviewApi,
    DockviewReadyEvent,
    IDockviewPanelProps,
    IWatermarkPanelProps,
    Orientation,
} from 'dockview-core';

const Panel = defineComponent({
    name: 'Panel',
    props: {
        api: {
            type: Object as PropType<IDockviewPanelProps['api']>,
            required: true,
        },
        containerApi: {
            type: Object as PropType<IDockviewPanelProps['containerApi']>,
            required: true,
        },
        params: {
            type: Object as PropType<IDockviewPanelProps['params']>,
            required: true,
        },
    },
    beforeMount() {
        console.log('mounted');
    },
    template: `
    <div style="height:100%;padding:20px;">
      Hello World
    </div>`,
});

const WatermarkPanel = defineComponent({
    name: 'Panel',
    props: {
        group: {
            type: Object as PropType<IWatermarkPanelProps['group']>,
            required: true,
        },
        containerApi: {
            type: Object as PropType<IWatermarkPanelProps['containerApi']>,
            required: true,
        },
    },
    setup(props) {
        return { isGroup: props.containerApi.groups.length > 0 };
    },
    methods: {
        onAddNewPanel() {
            this.containerApi.addPanel({
                id: Date.now().toString(),
                component: 'default',
            });
        },
        onCloseGroup() {
            this.group?.api.close();
        },
    },
    template: `
      <div style="height:100%;display:flex;justify-content:center;align-items:center;color:white;">
        <div style="display:flex;flex-direction:column;">
          <span>
          This is a custom watermark. You can put whatever React component you want here
          </span>
          <span>
            <button @click="onAddNewPanel">Add New Panel</button>
          </span>
        </div>
        <span v-if="isGroup">
          <button @click="onCloseGroup">Close Group</button>
        </span>
      </div>`,
});

const App = defineComponent({
    name: 'App',
    components: {
        'dockview-vue': DockviewVue,
        Panel,
    },
    data() {
        return {
            components: {
                default: Panel,
            },
            watermarkComponent: WatermarkPanel,
        };
    },
    methods: {
        onClick(event: MouseEvent) {
            if (!this.api) {
                return;
            }

            this.api.addGroup();
        },
        onReady(event: DockviewReadyEvent) {
            event.api.fromJSON({
                grid: {
                    orientation: Orientation.HORIZONTAL,
                    root: { type: 'branch', data: [] },
                    height: 100,
                    width: 100,
                },
                panels: {},
            });
        },
    },
    template: `
      <div style="display:flex;flex-direction:column;height:100%;">
        <div>
          <button @click="onClick">Add Empty Group</button>
        </div>
        <dockview-vue
          style="width:100%;height:100%"
          class="dockview-theme-abyss"
          @ready="onReady"
          :components="components"
          :watermarkComponent="watermarkComponent"
        >
        </dockview-vue>
      </div>`,
});

const app = createApp(App);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount(document.getElementById('app')!);
