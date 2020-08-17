const path = require('path'),
    fs = require('fs');

//Register's all routes and models
exports.registerModelsAndRoutes = function (router) {
    return new Promise((resolve, reject) => {
        const modulesFolder = path.resolve('./modules');
        const modules = fs.readdirSync(modulesFolder);
        modules.map((nestedModule) => {
            const fullPath = `${modulesFolder}/${nestedModule}`;
            const moduleFiles = fs.readdirSync(fullPath);

            moduleFiles.map((file) => {
                file = file.replace(".js", "");
                if (file.includes("model")) {
                    require(path.resolve(`${fullPath}/${file}`))
                } else if (file.includes("route")) {
                    require(path.resolve(`${fullPath}/${file}`))(router);
                }
            });
        });
        return resolve();
    });
}