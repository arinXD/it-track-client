"use client"
import { format } from 'date-fns';

const months = {
     "01": 'มกราคม',
     "02": 'กุมภาพันธ์',
     '03': 'มีนาคม',
     "04": 'เมษายน',
     "05": 'พฤษภาคม',
     "06": 'มิถุนายน',
     "07": 'กรกฎาคม',
     '08': 'สิงหาคม',
     "09": 'กันยายน',
     "10": 'ตุลาคม',
     "11": 'พฤศจิกายน',
     "12": 'ธันวาคม',
}

function getDateProperty(date) {
     const parsedDate = new Date(date);

     const day = format(parsedDate, 'dd');
     const month = format(parsedDate, 'MM');
     const thaiMonth = months[month];
     const year = parsedDate.getFullYear() + 543;
     const hours = format(parsedDate, 'HH');
     const minutes = format(parsedDate, 'mm');

     return {
          day,
          month,
          thaiMonth,
          year,
          hours,
          minutes,
     }
}

export function simpleDMYHM(date) {
     const { day, thaiMonth, year, hours, minutes } = getDateProperty(date)
     return `${day} ${thaiMonth} ${year} ${hours}:${minutes} น.`;
}
export function simpleDMY(date) {
     const { day, thaiMonth, year } = getDateProperty(date)
     return `${day} ${thaiMonth} ${year}`;
}