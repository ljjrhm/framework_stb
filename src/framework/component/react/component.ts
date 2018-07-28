import { enqueueSetState } from './set-state-queue'
import { PageEvent } from '../pageEvent';
import { HElement } from '../../basic/helement';

class Component {
    private isReactComponent: boolean;
    protected state: any;
    protected readonly props: any;
    private readonly identCode;
    protected readonly tags:HElement​​[];
    protected readonly index:number;

    constructor(props = {},identCode?,event?:PageEvent) {
        this.isReactComponent = true;

        this.state = {};
        this.props = props;
        this.identCode = identCode;

        this.subscribeToEvents = this.subscribeToEvents.bind(this,event);
    }

    setState(stateChange) {
        enqueueSetState(stateChange, this);
    }
    
    componentWillUpdate(){};
    componentDidUpdate(prevProps,prevState){};
    componentWillMount(){};
    componentDidMount(){};
    render(){};
    subscribeToEvents(event) {};
}

export default Component;