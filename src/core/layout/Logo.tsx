import {appConfigContext} from "../configuration/AppConfiguationContext";

export const Logo = (props: any) => {
    return <img {...props} src={appConfigContext.defaultLogo} alt={appConfigContext.defaultTitle}/>
};
