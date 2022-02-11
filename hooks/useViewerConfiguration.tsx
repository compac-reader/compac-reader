import { useEffect, useState } from "react";
import {
  insertViewerConfiguration,
  queryViewerConfiguration,
} from "../database";
import { ViewerConfiguration } from "../models/viewerConfiguration";

export function useViewerConfiguration() {
  const [configuration, setConfiguration] = useState<ViewerConfiguration>({
    fontSize: 20,
    paddingVertical: 30,
    paddingHorizontal: 50,
  });

  useEffect(() => {
    (async () => {
      const result = await queryViewerConfiguration();

      setConfiguration({
        fontSize: result.get('fontSize') || configuration.fontSize,
        paddingVertical: result.get('paddingVertical') || configuration.paddingVertical,
        paddingHorizontal: result.get('paddingHorizontal') || configuration.paddingHorizontal,
      });
    })();
  }, []);

  const updateConfiguration = async (configuration: ViewerConfiguration) => {
    setConfiguration(configuration);
    await insertViewerConfiguration(new Map(Object.entries(configuration)));
  };

  return [configuration, updateConfiguration] as const;
}
