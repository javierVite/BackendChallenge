/**
*  Provide a code review for the following file.
*
*  Treat this as if you are a senior developer 
*  and have to do many code reviews.  Be quick, concise, polite. Identify potential bugs.
*
*  Use comments for you code reviews.
*
*  Add comments to describe what the code is doing.
**/

const
  provisionedEngines = [],
  //
  provisionEngine = async () => {
    try {
      const
        engineConfigurations = await Engine.findAll(),
        {
          engineConfigsToProvision,
          provisionedEnginesExisting
        } = engineConfigurations.reduce((
          {
            engineConfigsToProvision,
            provisionedEnginesExisting
          },
          engineConfig
        ) => {
          const
            {
              engineId: engineIdFromConfig
            } = engineConfig,
            isProvisioned = provisionedEngines.some(
              ({ engineID }) => engineID === engineIdFromConfig
            );

          isProvisioned
            ? provisionedEnginesExisting.push(
                provisionedEngines.find(({ engineID }) => engineID === engineIdFromConfig)
              )
            : engineConfigsToProvision.push(engineConfig);

            return {
              engineConfigsToProvision,
              provisionedEnginesExisting
            };
          },
          {
            engineConfigsToProvision: [],
            provisionedEnginesExisting: []
          }
        ),
        provisionedEnginePromises = engineConfigsToProvision.reduce((
          newEnginePromises,
          config,
        ) => {
          const
            issues = [],
            addEngineIssue = ({
              label = "Engine Service",
              level = 'info',
              msg,
            }) => issues.push({
              label,
              level,
              msg,
            }),
            {
              ca,
              cert,
              id,
              key,
              engineId: engineID,
              engineName,
              vtnUrl,
            } = config,
            axiosConfig = {
              rejectUnauthorized: engineRejectUnauthorized
            },
            label = engineName ?? engineID ?? 'engine: unknown',
            promise = engineCreate({
              addEngineIssue,
              axiosConfig,
              ca,
              cert,
              id,
              isTestEngine,
              key,
              label,
              engineID,
              engineName,
              vtnUrl,
            }).then(({
              axios,
            }) => (
              issues.some(issue => issue.level === 'fatal')
                ? null
                : {
                  axios,
                  id,
                  isTestEngine,
                  label,
                  engineID,
                  vtnUrl
                }
            ));

          newEnginePromises.push(promise);

          return newEnginePromises;
        }, []),
        provisionedEngines = await (
          await Promise.all(provisionedEnginePromises)
        ).filter(Boolean);

      provisionedEngines.length = 0;
      provisionedEngines.push(...provisionedEnginesExisting);
      provisionedEngines.push(...provisionedEngines);

      return [...provisionedEngines];
    } catch (err) {
      return [];
    }
  },
  setupEngineService = (server) => {
    const
      engineHandle = setInterval(
        provisionEngine,
      );

    provisionEngine();
  };

  module.exports = {
    setupEngineService: engineServiceEnabled
      ? setupEngineService
      : noop,
    processAllEngineEenginets,
  };
