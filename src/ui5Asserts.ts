import { ui5ActionDef, ui5Steps, ui5StepType, ui5StepStatus } from "./ui5Action";
import { UI5BaseBuilderIntf } from "./ui5Builder";

class ui5AssertOperator {
    _selector: UI5BaseBuilderIntf;
    _testCafeSelector: any = null;
    _propertyName: string = "";
    _filterFunction: (e: any) => any = e => e;

    constructor(selector: UI5BaseBuilderIntf | Selector) {
        this._selector = <UI5BaseBuilderIntf>selector;
        this._testCafeSelector = selector instanceof UI5BaseBuilderIntf ? selector.build() : selector;
    }

    public setPropertyName(name: string) {
        this._propertyName = name;
    }

    public setDataFunction(t: (e: any) => any) {
        this._filterFunction = t;
    }

    public get toBe(): ui5AssertOperator {
        return this;
    }

    public async greater(val: any, message?: string, options?: AssertionOptions) {
        let oStep = ui5Steps.addStep(ui5StepType.ASSERT_PROPERTY_VALUE, ui5StepStatus.QUEUED, this._selector, (this._propertyName + " greater than '" + val.toString() + "'"));
        await this._selector.build();
        let oProm = ui5ActionDef.currentTestRun.expect(this._selector.dataSync(this._filterFunction)).gt(val, message, options);
        oProm.then(function () { //dmmy..
            ui5Steps.setStepStatus(oStep, ui5StepStatus.PROCESSED);
        }, function () {
            ui5Steps.setStepStatus(oStep, ui5StepStatus.FAILED);
        });
        return oProm;
    }

    public async less(val: any, message?: string, options?: AssertionOptions) {
        let oStep = ui5Steps.addStep(ui5StepType.ASSERT_PROPERTY_VALUE, ui5StepStatus.QUEUED, this._selector, (this._propertyName + " less than '" + val.toString() + "'"));
        await this._selector.build();
        let oProm = ui5ActionDef.currentTestRun.expect(this._selector.dataSync(this._filterFunction)).lt(val, message, options);
        oProm.then(function () { //dmmy..
            ui5Steps.setStepStatus(oStep, ui5StepStatus.PROCESSED);
        }, function () {
            ui5Steps.setStepStatus(oStep, ui5StepStatus.FAILED);
        });
        return oProm;
    }

    public async equal(val: any, message?: string, options?: AssertionOptions) {
        let oStep = ui5Steps.addStep(ui5StepType.ASSERT_PROPERTY_VALUE, ui5StepStatus.QUEUED, this._selector, (this._propertyName + " equal to '" + val.toString() + "'"));

        await this._selector.build(); //wait until generally available..
        let oProm = ui5ActionDef.currentTestRun.expect(this._selector.dataSync(this._filterFunction)).eql(val, message, options);
        oProm.then(function () { //dmmy..
            ui5Steps.setStepStatus(oStep, ui5StepStatus.PROCESSED);
        }, function () {
            ui5Steps.setStepStatus(oStep, ui5StepStatus.FAILED);
        });
        return oProm;
    }

    public async notEqual(val: any, message?: string, options?: AssertionOptions) {
        let oStep = ui5Steps.addStep(ui5StepType.ASSERT_PROPERTY_VALUE, ui5StepStatus.QUEUED, this._selector, (this._propertyName + " unequal to '" + val.toString() + "'"));

        await this._selector.build();
        let oProm = ui5ActionDef.currentTestRun.expect(this._selector.dataSync(this._filterFunction)).notEql(val, message, options);
        oProm.then(function () { //dmmy..
            ui5Steps.setStepStatus(oStep, ui5StepStatus.PROCESSED);
        }, function () {
            ui5Steps.setStepStatus(oStep, ui5StepStatus.FAILED);
        });
        return oProm;
    }
}

class ui5AssertOperatorVisible extends ui5AssertOperator {
    async ok(message?: string, options?: AssertionOptions) {
        let oStep = ui5Steps.addStep(ui5StepType.ASSERT_VISIBLE, ui5StepStatus.QUEUED, this._selector);
        try {
            await ui5ActionDef.currentTestRun.expect(this._testCafeSelector.exists).ok(message, options);
            await ui5ActionDef.currentTestRun.expect(this._testCafeSelector.visible).ok(message, options);
        } catch (err) {
            ui5Steps.setStepStatus(oStep, ui5StepStatus.FAILED);
            throw err;
        }

        ui5Steps.setStepStatus(oStep, ui5StepStatus.PROCESSED);
    }

    async notOK(message?: string, options?: AssertionOptions) {
        let oStep = ui5Steps.addStep(ui5StepType.ASSERT_VISIBLE, ui5StepStatus.QUEUED, this._selector);
        try {
            await ui5ActionDef.currentTestRun.expect(this._testCafeSelector.visible).notOk(message, options);
        } catch (err) {
            ui5Steps.setStepStatus(oStep, ui5StepStatus.FAILED);
            return;
        }

        ui5Steps.setStepStatus(oStep, ui5StepStatus.PROCESSED);
    }
}


class ui5AssertDef {
    private _selector: UI5BaseBuilderIntf | Selector;

    public visible(expectInteractable: boolean = true): ui5AssertOperatorVisible {
        let selector = this._selector;
        if (expectInteractable === true) {
            selector = selector instanceof UI5BaseBuilderIntf ? selector.interactable() : selector;
        }

        let oOperator = new ui5AssertOperatorVisible(this._selector);
        return oOperator;
    }

    public property(property: string): ui5AssertOperator {
        let oOperator = new ui5AssertOperator(this._selector);
        oOperator.setPropertyName(property);
        var f: (e: any) => any = <any>new Function('e', 'return e.property["' + property + '"];');
        oOperator.setDataFunction(f);

        return oOperator;
    }

    public tableLength(): ui5AssertOperator {
        let oOperator = new ui5AssertOperator(this._selector);
        oOperator.setDataFunction((e) => e.tableData.finalLength);

        return oOperator;
    }

    public element(property: (e: any) => any): ui5AssertOperator {
        let oOperator = new ui5AssertOperator(this._selector);
        oOperator.setDataFunction(property);

        return oOperator;
    }

    public constructor(selector: UI5BaseBuilderIntf | Selector) {
        this._selector = selector;
    }
}


function ui5Assert(selector: UI5BaseBuilderIntf | Selector) {
    return new ui5AssertDef(selector);
}

export { ui5Assert, ui5AssertDef, ui5AssertOperator, ui5AssertOperatorVisible };