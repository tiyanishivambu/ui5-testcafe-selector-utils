import { ui5Password } from "./ui5Password";

export interface ui5CoverageConfiguration {
    outDir?: string,
    type?: string,
    proxy?: boolean,
    enabled?: boolean,
    log?: boolean,
    timeoutIncreaseFactor?: number,
    basePath?: string,
    debugComponents?: string[],
    includePaths?: string[],
    excludePaths?: string[]
}

export interface ui5RestConfiguration {
    url: string,
    videoUrl: string,
    user: string,
    password: string
}

export interface ui5LaunchpadConfiguration {
    deactivateAnimation?: boolean;
}

export interface ui5Configuration {
    coverage: ui5CoverageConfiguration;
    rest?: ui5RestConfiguration;
    launchpad?: ui5LaunchpadConfiguration;
    testDataUrl: string,
    testDataDelFunction: string,
    testDataCreateFunction: string,
    firstSelectorTimeout: number;
    traceSelectorOnFailure: boolean;
    tileOpeningTimeout: number;
    cacheResources: boolean;
    logSelectorOnFailure: boolean;
    clearCache: boolean;
};

class ui5ConfigDef {
    private _config: ui5Configuration;

    constructor() {
        try {
            this._config = require(process.cwd() + '\\.ui5-testcafe.json');
        } catch {
            this._config = {
                coverage: {
                    outDir: "",
                    basePath: "",
                    type: "html",
                    enabled: false,
                    log: false,
                    proxy: false,
                    debugComponents: [],
                    includePaths: [],
                    excludePaths: [],
                    timeoutIncreaseFactor: 3
                },
                launchpad: {
                    deactivateAnimation: false
                },
                firstSelectorTimeout: 60000,
                tileOpeningTimeout: 60000,
                testDataUrl: '',
                testDataDelFunction: '',
                testDataCreateFunction: '',

                logSelectorOnFailure: false,
                traceSelectorOnFailure: false,
                cacheResources: false,
                clearCache: false
            };
        }

        if (typeof this._config.coverage === "undefined") {
            this._config.coverage = {};
        }
        if (typeof this._config.coverage.enabled === "undefined") {
            this._config.coverage.enabled = false;
        }
        if (typeof this._config.coverage.basePath === "undefined") {
            this._config.coverage.basePath = "";
        }
        if (typeof this._config.testDataUrl === "undefined") {
            this._config.testDataUrl = "";
        }
        if (typeof this._config.coverage.proxy === "undefined") {
            this._config.coverage.proxy = false;
        }
        if (typeof this._config.coverage.outDir === "undefined") {
            this._config.coverage.outDir = "./report/coverage";
        }
        if (typeof this._config.rest !== "undefined") {
            this._config.rest.password = ui5Password.decrypt(this._config.rest.password);
        }
        if (typeof this._config.launchpad === "undefined") {
            this._config.launchpad = {};
        }
        if (typeof this._config.launchpad.deactivateAnimation === "undefined") {
            this._config.launchpad.deactivateAnimation = false;
        }

        this._config.tileOpeningTimeout = this._config.tileOpeningTimeout ? this._config.tileOpeningTimeout : 40000;
        this._config.firstSelectorTimeout = this._config.firstSelectorTimeout ? this._config.firstSelectorTimeout : 40000;
        this._config.coverage.enabled = process.env.UI5_COVERAGE_ENABLED ? process.env.UI5_COVERAGE_ENABLED === "true" : this._config.coverage.enabled;
        this._config.coverage.timeoutIncreaseFactor = this._config.coverage.timeoutIncreaseFactor ? this._config.coverage.timeoutIncreaseFactor : 3;
        if (this._config.coverage.enabled === false) {
            this._config.coverage.timeoutIncreaseFactor = 1;
        }
        
        this._config.logSelectorOnFailure = typeof this._config.logSelectorOnFailure === "undefined" ? false : this._config.logSelectorOnFailure;
        this._config.traceSelectorOnFailure = typeof this._config.traceSelectorOnFailure === "undefined" ? false : this._config.traceSelectorOnFailure;
        this._config.clearCache = typeof this._config.clearCache === "undefined" ? false : this._config.clearCache;
        this._config.cacheResources = typeof this._config.cacheResources === "undefined" ? false : this._config.cacheResources;
    }

    get traceSelectorOnFailure(): boolean {
        return this._config.traceSelectorOnFailure;
    }

    get logSelectorOnFailure() : boolean {
        return this._config.logSelectorOnFailure;
    }

    get testDataUrl(): string {
        return this._config.testDataUrl;
    }
    get testDataDelFunction(): string {
        return this._config.testDataDelFunction;
    }
    get testDataCreateFunction(): string {
        return this._config.testDataCreateFunction;
    }

    get timeoutIncreaseFactor(): number {
        return <any>this._config.coverage.timeoutIncreaseFactor;
    }

    get firstSelectorTimeout(): number {
        return this._config.firstSelectorTimeout;
    }

    get tileOpeningTimeout(): number {
        return this._config.tileOpeningTimeout;
    }

    get clearCache(): boolean {
        return this._config.clearCache;
    }

    get cacheResources(): boolean {
        return this._config.cacheResources;
    }

    get launchpad(): ui5LaunchpadConfiguration {
        return this._config.launchpad ? this._config.launchpad : { deactivateAnimation: false };
    }

    get coverage(): ui5CoverageConfiguration {
        return this._config.coverage;
    }
    get rest(): ui5RestConfiguration | undefined {
        return this._config.rest;
    }
}


export let ui5Config = new ui5ConfigDef();
