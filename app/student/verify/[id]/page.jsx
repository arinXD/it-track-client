"use client"
import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchData, fetchDataObj } from '../../../admin/action'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { format } from 'date-fns';
import Swal from 'sweetalert2'
import axios from 'axios';
import { getOptions } from '@/app/components/serverAction/TokenAction';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { inputClass } from '@/src/util/ComponentClass';
import { getCurrentDate } from '@/src/util/dateFormater';
import { PlusIcon, EditIcon, DeleteIcon, EditIcon2, DeleteIcon2, SearchIcon, EyeIcon } from "@/app/components/icons";
import { FaPlay } from "react-icons/fa";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { CiUndo } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import { calGrade, floorGpa, isNumber } from '@/src/util/grade';
import { utils, writeFile } from "xlsx";
import { tableClass } from '@/src/util/ComponentClass'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useKbd, Spinner, Tooltip } from '@nextui-org/react'
import { Loading } from '@/app/components';
import { Empty, message } from 'antd';
import { RadioGroup, Radio } from "@nextui-org/radio";

const Page = ({ params }) => {
    const { id } = params
    return (
        <>
            <p>test</p>
        </>
    )
}

export default Page