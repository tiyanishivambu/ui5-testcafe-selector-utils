import { t } from "testcafe";
import { LoginUser, SystemType, UserRole, ui5Constants } from "./ui5Constants";
import { ui5TestData } from "./ui5TestData";

import { request } from "http";
import { ui5Config } from "./ui5Config";

export interface ui5QueryParametersQry {
    queryName: string;
    includeKeyFigures?: boolean;
    columnNames: string[],
    variableValues?: [{
        name: string;
        sign: "I" | "E",
        opt: "EQ" | "NE" | "BT" | "NB" | "LE" | "GT" | "GE" | "LT" | "CP" | "NP",
        valueLow: string;
        valueHigh?: string;
    }]
    filterValues?: [{
        name: string;
        sign: "I" | "E",
        opt: "EQ" | "NE" | "BT" | "NB" | "LE" | "GT" | "GE" | "LT" | "CP" | "NP",
        valueLow: string;
        valueHigh?: string;
    }]
}

export interface ui5QueryParameters {
    role: UserRole;
    testData?: string;
    query: ui5QueryParametersQry;
}

class ui5QueryRunnerDef {
    async geetData(params: ui5QueryParameters) {
        let user = this.getUser(params.role);

        //if wanted, wait for further actions..
        if (params.testData) {
            await ui5TestData.createTestData(params.role, params.testData, t.ctx.testCase);
        }

        const results = await this._getData(user, params.query);
    }

    private async _getData(user: LoginUser, postData: ui5QueryParametersQry) {
        return new Promise((resolve) => {
            const str = JSON.stringify(postData);
            var auth = 'Basic ' + Buffer.from(user.user + ':' + user.pw).toString('base64');

            const options = {
                hostname: ui5Constants.getHost(SystemType.FIORI),
                path: ui5Config.queryRunnerUrl + ui5Constants.getURLOption(SystemType.FIORI),
                port: ui5Constants.getPort(SystemType.FIORI),
                rejectUnauthorized: false,
                headers: {
                    'Authorization': auth,
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                },
                method: 'POST'
            };
            const req = request(options, res => {
                let output = ''
                res.setEncoding('utf8')

                // Listener to receive data
                res.on('data', (chunk) => {
                    output += chunk
                });

                // Listener for intializing callback after receiving complete response
                res.on('end', () => {
                    let obj = JSON.parse(output)
                    resolve(obj)
                });
            });

            const data = JSON.stringify(postData)
            req.write(data);
            req.end();
        });
    }

    private getUser(role: UserRole): LoginUser {
        return ui5Constants.getUser(role, SystemType.FIORI);
    }
}