import {ReactNode} from 'react';
import {
  Admin,
  DataProvider,
  localStorageStore,
  Resource,
  StoreContextProvider,
  type TranslationMessages,
  useStore
} from 'react-admin';
import {Theme} from './themes/themes';
import {Layout} from './layout/Layout';
import {Login} from './pages/Login';
import {i18nProvider} from "./component/I18nProvider";
import {appConfigContext} from "./configuration/AppConfiguationContext";
import type {PanelInterface} from "./PanelInterface";
import {CustomRoutes} from "ra-core";
import type {ExtendedAuthProviderInterface} from "../interface/ExtendedAuthProviderInterface";
import {GlobalLoadingProvider} from "./component/GlobalLoadingContext";

// Define props interface for App component
interface AppProps {
  children?: ReactNode;
  dashboard: React.ComponentType<any>;
  authProvider:ExtendedAuthProviderInterface;
  dataProvider:DataProvider;
  themeList: Theme[];
  panels: PanelInterface[];
  i18n?:Record<string,TranslationMessages>;
}

// Define props interface for AppWrapper component
interface AppWrapperProps extends AppProps {}

const store = localStorageStore(undefined, appConfigContext.defaultTitle);

const App = ({
               children,
               dashboard,
               authProvider,
               dataProvider,
               themeList,
               panels,
               i18n
             }: AppProps) => {
  if(!themeList || themeList.length === 0) {
    throw new Error('No theme defined');
  }
  const [themeName] = useStore<string>('themeName', 'default');
  const lightTheme = themeList.find(theme => theme.name === themeName)?.light;
  const darkTheme = themeList.find(theme => theme.name === themeName)?.dark;

  const panelsRoutes:any[] = [];
  for (const panel of panels) {
    if(panel.route) {
      for (const route of panel.route.routes) {
        panelsRoutes.push(route);
      }
    }
  }

  return (
    <Admin
      title=""
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={dashboard}
      loginPage={Login}
      layout={Layout(panels)}
      i18nProvider={i18nProvider(panels,i18n)}
      disableTelemetry
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
    >
      <CustomRoutes>
        {panelsRoutes.map(value => {
          return value
        })}
      </CustomRoutes>
      {panels.map(value => {
        if(value.resource) {
          return <Resource key={value.name} {...value.resource} />
        }
        return null;
      })}
      {children}
    </Admin>
  );
};

export const AppWrapper = ({
                      children,
                      dashboard,
                      authProvider,
                      dataProvider,
                      themeList,
                      panels,
                    }: AppWrapperProps) => (
  <StoreContextProvider value={store}>
    <GlobalLoadingProvider>
      <App
        authProvider={authProvider}
        dataProvider={dataProvider}
        dashboard={dashboard}
        panels={panels}
        themeList={themeList}
      >
        {children}
      </App>
    </GlobalLoadingProvider>
  </StoreContextProvider>
);