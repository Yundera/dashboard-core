import {Layout as RaLayout} from 'react-admin';
import {Menu} from './Menu';
import React from "react";
import type {PanelInterface} from "../PanelInterface";

export const Layout = (panels: PanelInterface[]) => ({ children }: { children: React.ReactNode }) => (
    <RaLayout menu={Menu(panels)} appBar={() => null}>
        {children}
    </RaLayout>
);
