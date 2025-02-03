import { AppBar, Box, Button, Container, Tab, Tabs } from '@mui/material';
import { Outlet } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Root = () => {
    
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;