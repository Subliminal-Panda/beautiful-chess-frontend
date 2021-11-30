import React, { useContext } from 'react';
import Login from './login';
import Table from './table';

const routes = {
    '/': () => <Login />,
    '/game': () => <Table />,
}

export default routes;
