import 'dockview-core/dist/styles/dockview.css';
import { PropType, createApp, defineComponent } from 'vue';
import { DockviewVue } from 'dockview-vue';
import { DockviewReadyEvent, IDockviewPanelProps } from 'dockview-core';

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
    data() {
        return {
            title: '',
        };
    },
    mounted() {
        const disposable = this.api.onDidTitleChange(() => {
            this.title = this.api.title;
        });
        this.title = this.api.title;

        return () => {
            disposable.dispose();
        };
    },
    template: `
  <div style="height:100%;padding:20px;color:white;">
    <div>{{title}}</div>
  </div>`,
});

const InnerDockview = defineComponent({
    name: 'App',
    components: {
        'dockview-vue': DockviewVue,
        Panel,
    },
    data() {
        return {
            components: {
                default: Panel,
                innerDockview: InnerDockview,
            },
        };
    },
    methods: {
        onReady(event: DockviewReadyEvent) {
            event.api.addPanel({
                id: 'panel_1',
                component: 'default',
            });

            event.api.addPanel({
                id: 'panel_2',
                component: 'default',
            });

            event.api.addPanel({
                id: 'panel_3',
                component: 'default',
            });
        },
    },
    template: `
    <dockview-vue
      style="width:100%;height:100%"
      class="dockview-theme-abyss"
      :components="components"
      @ready="onReady"
    </dockview-vue>`,
});

const App = defineComponent({
    name: 'App',
    components: {
        'dockview-vue': DockviewVue,
        Panel,
        InnerDockview,
    },
    data() {
        return {
            components: {
                default: Panel,
                innerDockview: InnerDockview,
            },
        };
    },
    methods: {
        onReady(event: DockviewReadyEvent) {
            event.api.addPanel({
                id: 'panel_1',
                component: 'default',
            });

            event.api.addPanel({
                id: 'panel_2',
                component: 'default',
            });

            event.api.addPanel({
                id: 'panel_3',
                component: 'innerDockview',
                position: { referencePanel: 'panel_2', direction: 'right' },
            });
        },
    },
    template: `
      <dockview-vue
        style="width:100%;height:100%"
        class="dockview-theme-abyss"
        :components="components"
        @ready="onReady"
      </dockview-vue>`,
});

const app = createApp(App);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount(document.getElementById('app')!);
