import 'dockview-core/dist/styles/dockview.css';
import { Prop, PropType, createApp, defineComponent } from 'vue';
import { DockviewVue } from 'dockview-vue';
import {
    DockviewReadyEvent,
    IDockviewHeaderActionsProps,
    IDockviewPanelProps,
} from 'dockview-core';

let panelCount = 0;

const MaterialIcon = defineComponent({
    name: 'MaterialIcon',
    props: {
        icon: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: false,
        },
    },
    emits: ['click'],
    data() {
        return {
            title: this.title,
            icon: this.icon,
        };
    },
    methods: {
        onClick() {
            this.$emit('click');
        },
    },
    template: `
      <div
        @click="onClick"
        title="title"
        style="display:flex;justify-content:center;align-items:center;width:30px;height:100%;font-size:18px;">
          <span class="material-symbols-outlined" style="font-size:inherit;cursor:pointer;">
            {{icon}}
          </span>
      </div>`,
});

const LeftAction = defineComponent({
    name: 'LeftAction',
    props: {
        containerApi: {
            type: Object as PropType<
                IDockviewHeaderActionsProps['containerApi']
            >,
            required: true,
        },
        group: {
            type: Object as PropType<IDockviewHeaderActionsProps['group']>,
            required: true,
        },
    },
    components: {
        'material-icon': MaterialIcon,
    },
    methods: {
        onClick() {
            this.containerApi.addPanel({
                id: (++panelCount).toString(),
                title: `Tab ${panelCount}`,
                component: 'default',
                position: { referenceGroup: this.group },
            });
        },
    },
    template: `
      <div style="height:100%;color:white;padding:0px 4px;">
        <material-icon @click="onClick" icon="add"></material-icon>
      </div>`,
});

const RightAction = defineComponent({
    name: 'RightAction',
    props: {
        containerApi: {
            type: Object as PropType<
                IDockviewHeaderActionsProps['containerApi']
            >,
            required: true,
        },
        api: {
            type: Object as PropType<IDockviewHeaderActionsProps['api']>,
            required: true,
        },
        group: {
            type: Object as PropType<IDockviewHeaderActionsProps['group']>,
            required: true,
        },
    },
    data() {
        return {
            maximized: false,
        };
    },
    mounted() {
        const disposable = this.containerApi.onDidMaximizedGroupChange(() => {
            this.maximized = this.api.isMaximized();
        });

        this.maximized = this.api.isMaximized();

        return () => {
            disposable.dispose();
        };
    },
    components: {
        'material-icon': MaterialIcon,
    },
    methods: {
        onClick() {
            if (this.maximized) {
                this.api.exitMaximized();
            } else {
                this.api.maximize();
            }
        },
    },
    template: `
      <div style="height:100%;color:white;padding:0px 4px;">
        <material-icon v-if="maximized" @click="onClick" icon="jump_to_element" ></material-icon>
        <material-icon v-if="!maximized" @click="onClick" icon="back_to_tab"></material-icon>
      </div>`,
});

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
      <div style="color:white;">
        <div>{{title}}</div>
      </div>`,
});

const App = defineComponent({
    name: 'App',
    components: {
        'dockview-vue': DockviewVue,
        Panel,
        LeftAction,
        RightAction,
    },
    data() {
        return {
            components: {
                default: Panel,
            },
            leftAction: LeftAction,
            rightAction: RightAction,
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
                position: {
                    direction: 'right',
                    referencePanel: 'panel_1',
                },
            });
            event.api.addPanel({
                id: 'panel_3',
                component: 'default',
                position: {
                    direction: 'below',
                    referencePanel: 'panel_1',
                },
            });
            event.api.addPanel({
                id: 'panel_4',
                component: 'default',
            });
            event.api.addPanel({
                id: 'panel_5',
                component: 'default',
            });
        },
    },
    computed: {
        styleObject() {
            return {
                height: `${this.value}%`,
                width: `${this.value}%`,
            };
        },
    },
    template: `
      <dockview-vue
        style="width:100%;height:100%"
        class="dockview-theme-abyss"
        @ready="onReady"
        :components="components"
        :leftHeaderActionsComponent="leftAction"
        :rightHeaderActionsComponent="rightAction"
      </dockview-vue>`,
});

const app = createApp(App);
app.config.errorHandler = (err) => {
    console.log(err);
};
app.mount(document.getElementById('app')!);
