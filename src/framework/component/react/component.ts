import { enqueueSetState } from './set-state-queue'


class Component {
    private isReactComponent: boolean;
    protected state: any;
    protected readonly props: any;

    constructor(props = {}) {
        this.isReactComponent = true;

        this.state = {};
        this.props = props;
    }

    setState(stateChange) {
        enqueueSetState(stateChange, this);
    }
    
}

export default Component;