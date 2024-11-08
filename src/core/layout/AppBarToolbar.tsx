import {LocalesMenuButton} from 'react-admin';
import {LoadingIndicator} from "../component/LoadinIndicator";

export const AppBarToolbar = () => (
    <>
        <LoadingIndicator />
        <LocalesMenuButton />
        {/*<ThemeSwapper />*/}
    </>
);
