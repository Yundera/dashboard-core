import {Layout as RaLayout} from 'react-admin';
import {AppBar} from './AppBar';
import {Menu} from './Menu';
import React from "react";
import type {PanelInterface} from "../PanelInterface";

export const Layout = (panels: PanelInterface[]) => ({ children }: { children: React.ReactNode }) => (
    <RaLayout appBar={AppBar} menu={Menu(panels)}>
        {children}
    </RaLayout>
);
