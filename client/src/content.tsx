// import React from "react";
import { createRoot } from 'react-dom/client';
import ChatWidget from "./component/ChatWidget";

const root = document.createElement('div');
root.id = '_leetcode_extension_root';
document.body.appendChild(root);

createRoot(root).render(<ChatWidget />);