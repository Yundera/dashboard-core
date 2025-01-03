import {ComponentType, Suspense, useEffect, useState} from 'react';
import {Box, CircularProgress} from "@mui/material";
import {loadBackendConfiguration} from "./configuration/BackendConfigurationLoader";
import {DataProvider} from "react-admin";
import type {AuthProvider} from "ra-core";

interface AppLoaderProps {
  AppComponent: ComponentType<{
    authProvider:AuthProvider;
    dataProvider:DataProvider;
    permissions:Record<string,boolean>;
  }>;  // Type for the App component prop
  providers: () => Promise<{
    authProvider:AuthProvider;
    dataProvider:DataProvider;
  }>;  // Function to load providers
  LoadingComponent?: ComponentType;  // Optional custom loading component
}

export function AppLoader({
                                    AppComponent,
                                    LoadingComponent,
                                    providers,
                                  }: AppLoaderProps) {
  const [isFirebaseConfigLoaded, setIsFirebaseConfigLoaded] = useState(false);
  const [provids, setProvids] = useState<{
    authProvider:AuthProvider;
    dataProvider:DataProvider;
  }>();
  const [permissions, setPermissions] = useState<Record<string,boolean>>({});

  useEffect(() => {
    const loadFirebaseConfig = async () => {
      try {
        await loadBackendConfiguration();
        let p = await providers();
        setProvids(p);
        let permissions = await p.authProvider.listPermissions();
        console.log('listPermissions',permissions);
        setPermissions(permissions);
        setIsFirebaseConfigLoaded(true);
      } catch (error) {
        console.error('Error loading Firebase config:', error);
      }
    };

    loadFirebaseConfig().catch(console.error);
  }, []);

  const DefaultLoader = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        width: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );

  const LoaderComponent = LoadingComponent || DefaultLoader;

  if (!isFirebaseConfigLoaded || !provids) {
    return <LoaderComponent />;
  }

  return (
    <Suspense fallback={<LoaderComponent />}>
      <AppComponent authProvider={provids.authProvider}  dataProvider={provids.dataProvider} permissions={permissions}/>
    </Suspense>
  );
}