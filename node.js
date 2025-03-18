'use strict'



const
  provisionedEnelxVens = [],
  //
  provisionVens = async () => {
    try {
      const
        enelxVenConfigurations = await EnelXVen.findAll(),
        {
          venConfigsToProvision,
          provisionedVensExisting
        } = enelxVenConfigurations.reduce((
          {
            venConfigsToProvision,
            provisionedVensExisting
          },
          venConfig
        ) => {
          const
            {
              venId: venIdFromConfig
            } = venConfig,
            isProvisioned = provisionedEnelxVens.some(
              ({ venID }) => venID === venIdFromConfig
            );

          isProvisioned
            ? provisionedVensExisting.push(
                provisionedEnelxVens.find(({ venID }) => venID === venIdFromConfig)
              )
            : venConfigsToProvision.push(venConfig);

            return {
              venConfigsToProvision,
              provisionedVensExisting
            };
          },
          {
            venConfigsToProvision: [],
            provisionedVensExisting: []
          }
        ),
        provisionedVenPromises = venConfigsToProvision.reduce((
          newVenPromises,
          config,
        ) => {
          const
            issues = [],
            addVenIssue = ({
              label = "Ven Service",
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
              venId: venID,
              venName,
              vtnUrl,
            } = config,
            axiosConfig = {
              rejectUnauthorized: venRejectUnauthorized
            },
            label = venName ?? venID ?? 'ven: unknown',
            promise = enelXVenCreate({
              addVenIssue,
              axiosConfig,
              ca,
              cert,
              id,
              isTestVen,
              key,
              label,
              venID,
              venName,
              vtnUrl,
            }).then(({
              axios,
            }) => (
              issues.some(issue => issue.level === 'fatal')
                ? null
                : {
                  axios,
                  id,
                  isTestVen,
                  label,
                  venID,
                  vtnUrl
                }
            ));

          newVenPromises.push(promise);

          return newVenPromises;
        }, []),
        provisionedVens = await (
          await Promise.all(provisionedVenPromises)
        ).filter(Boolean);

      provisionedEnelxVens.length = 0;
      provisionedEnelxVens.push(...provisionedVensExisting);
      provisionedEnelxVens.push(...provisionedVens);

      return [...provisionedEnelxVens];
    } catch (err) {
      return [];
    }
  },
  setupVenService = (server) => {
    const
      venHandle = setInterval(
        provisionVens,
      );

    provisionVens();
  };

  module.exports = {
    setupVenService: venServiceEnabled
      ? setupVenService
      : noop,
    processAllVenEvents,
  };
