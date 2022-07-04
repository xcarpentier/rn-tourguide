import * as React from 'react';
export class ConnectedStep extends React.Component {
    componentDidMount() {
        if (this.props.active) {
            this.register();
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.active !== prevProps.active) {
            if (this.props.active) {
                this.register();
            }
            else {
                this.unregister();
            }
        }
    }
    componentWillUnmount() {
        this.unregister();
    }
    setNativeProps(obj) {
        this.wrapper.setNativeProps(obj);
    }
    register() {
        if (this.props.context && this.props.context.registerStep) {
            this.props.context.registerStep(this.props.tourKey, {
                target: this,
                wrapper: this.wrapper,
                ...this.props,
            });
        }
        else {
            console.warn('context undefined');
        }
    }
    unregister() {
        if (this.props.context && this.props.context.unregisterStep) {
            this.props.context.unregisterStep(this.props.tourKey, this.props.name);
        }
        else {
            console.warn('unregisterStep undefined');
        }
    }
    measure() {
        if (typeof __TEST__ !== 'undefined' && __TEST__) {
            return new Promise((resolve) => resolve({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            }));
        }
        return new Promise((resolve, reject) => {
            const measure = () => {
                if (this.wrapper && this.wrapper.measure) {
                    const { borderRadius } = this.props;
                    this.wrapper.measure((_ox, _oy, width, height, x, y) => resolve({
                        x: borderRadius ? x + borderRadius : x,
                        y,
                        width: borderRadius ? width - borderRadius * 2 : width,
                        height,
                    }), reject);
                }
                else {
                    requestAnimationFrame(measure);
                }
            };
            requestAnimationFrame(measure);
        });
    }
    render() {
        const copilot = {
            ref: (wrapper) => {
                this.wrapper = wrapper;
            },
            onLayout: () => { },
        };
        return React.cloneElement(this.props.children, { copilot });
    }
}
ConnectedStep.defaultProps = {
    active: true,
};
