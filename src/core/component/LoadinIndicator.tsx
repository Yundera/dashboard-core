import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import clsx from 'clsx';
import { useLoading } from 'ra-core';

import { SxProps } from '@mui/system';

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
    const { className, sx, ...rest } = props;
    const loading = useLoading();

    const theme = useTheme();
    return (<>
        {loading && (
          <CircularProgress
            className={clsx(
              'app-loader',
              LoadingIndicatorClasses.loader
            )}
            color="inherit"
            size={theme.spacing(2)}
            thickness={6}
            {...rest}
          />
        )}</>);
};

interface Props {
    className?: string;
    sx?: SxProps;
}

type LoadingIndicatorProps = Props;

const PREFIX = 'RaLoadingIndicator';

export const LoadingIndicatorClasses = {
    loader: `${PREFIX}-loader`,
    loadedLoading: `${PREFIX}-loadedLoading`,
    loadedIcon: `${PREFIX}-loadedIcon`,
};

