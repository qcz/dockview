import 'dockview-core/dist/styles/dockview.css';
import { PropType, createApp, defineComponent } from 'vue';
import { DockviewVue } from 'dockview-vue';
import {
    DockviewReadyEvent,
    IDockviewPanelHeaderProps,
    IDockviewPanelProps,
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
    data() {
        return {
            isRunning: false,
            title: null,
        };
    },
    methods: {
        toggle() {
            this.isRunning = !this.isRunning;
        },
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
    watch: {
        isRunning(newValue, oldValue) {
            if (!newValue) {
                return;
            }

            const interval = setInterval(() => {
                this.api.updateParameters({ myValue: Date.now() });
            }, 1000);
            this.api.updateParameters({ myValue: Date.now() });

            return () => {
                clearInterval(interval);
            };
        },
    },
    template: `
      <div style="height:100%;color:white;">
        <div>{{title}}</div>
        <button v-if="!isRunning" @click="toggle">Start</button>
        <button v-if="isRunning" @click="toggle">Stop</button>
      </div>`,
});

const Tab = defineComponent({
    name: 'Tab',
    props: {
        api: {
            type: Object as PropType<IDockviewPanelHeaderProps['api']>,
            required: true,
        },
        containerApi: {
            type: Object as PropType<IDockviewPanelHeaderProps['containerApi']>,
            required: true,
        },
        params: {
            type: Object as PropType<IDockviewPanelHeaderProps['params']>,
            required: true,
        },
    },
    data() {
        return {
            title: '',
            value: null,
        };
    },
    mounted() {
        const disposable = this.api.onDidTitleChange(() => {
            this.title = this.api.title;
        });

        const disposable2 = this.api.onDidParametersChange(() => {
            this.value = this.params.myValue;
        });

        this.title = this.api.title;
        this.value = this.params.myValue;

        return () => {
            disposable.dispose();
            disposable2.dispose();
        };
    },
    template: `
    <div>
      <div>custom tab: {{title}}</div>
      <div>value: {{value}}</div>
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
            tabComponents: {
                default: Tab,
            },
        };
    },
    methods: {
        onReady(event: DockviewReadyEvent) {
            event.api.addPanel({
                id: 'panel_1',
                component: 'default',
                tabComponent: 'default',
                params: {
                    myValue: Date.now(),
                },
            });

            event.api.addPanel({
                id: 'panel_2',
                component: 'default',
                tabComponent: 'default',
                params: {
                    myValue: Date.now(),
                },
            });
        },
    },
    template: `
      <dockview-vue
        style="width:100%;height:100%"
        class="dockview-theme-abyss"
        @ready="onReady"
        :components="components"
        :tabComponents="tabComponents"
      </dockview-vue>`,
});

const app = createApp(App);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount(document.getElementById('app')!);
