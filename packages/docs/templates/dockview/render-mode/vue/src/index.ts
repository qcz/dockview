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
            renderer: null,
        };
    },
    methods: {
        onToggleRenderMode() {
            this.api.setRenderer(
                this.api.renderer === 'onlyWhenVisible'
                    ? 'always'
                    : 'onlyWhenVisible'
            );
        },
    },
    mounted() {
        const disposable = this.api.onDidTitleChange(() => {
            this.title = this.api.title;
        });
        const disposable2 = this.api.onDidRendererChange((event) => {
            this.renderer = event.renderer;
        });

        this.title = this.api.title;
        this.renderer = this.api.renderer;

        return () => {
            disposable.dispose();
            disposable2.dispose();
        };
    },
    template: `
    <div style="height:100%;color:white;">
      <div>{{title}}</div>
      <button @click="onToggleRenderMode">{{renderer}}</button>
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
        };
    },
    methods: {
        onReady(event: DockviewReadyEvent) {
            event.api.addPanel({
                id: 'panel_1',
                component: 'default',
                title: 'Panel 1',
            });

            event.api.addPanel({
                id: 'panel_2',
                component: 'default',
                title: 'Panel 2',
                position: { referencePanel: 'panel_1', direction: 'within' },
            });

            event.api.addPanel({
                id: 'panel_3',
                component: 'default',
                title: 'Panel 3',
            });

            event.api.addPanel({
                id: 'panel_4',
                component: 'default',
                title: 'Panel 4',
                position: { referencePanel: 'panel_3', direction: 'below' },
            });
        },
    },
    template: `
      <dockview-vue
        style="width:100%;height:100%"
        class="dockview-theme-abyss"
        @ready="onReady"
        :components="components"
      </dockview-vue>`,
});

const app = createApp(App);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount(document.getElementById('app')!);
