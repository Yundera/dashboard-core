import {Layout} from 'react-admin';
import AppBar from './AppBar';
import {Menu} from './Menu';
import React from "react";
import type {PanelInterface} from "../PanelInterface";

const LayoutComp = (panels: PanelInterface[]) => ({ children }: { children: React.ReactNode }) => (
    <Layout appBar={AppBar} menu={Menu(panels)}>
        {children}
    </Layout>
);

export default LayoutComp;
