import React, { useRef, useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { format } from 'date-fns';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler, Legend);
gsap.registerPlugin(ScrollTrigger);
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'rgba(255, 255, 255, 1)',
            bodyColor: 'rgba(255, 255, 255, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
        }
    },
    scales: {
        x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
        },
        y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.5)' }
        }
    }
};
export const WeatherCharts = () => {
    const { forecast } = useWeather();
    const sectionRef = useRef(null);
    useEffect(() => {
        if (!sectionRef.current)
            return;
        const cards = sectionRef.current.querySelectorAll('.chart-card');
        gsap.fromTo(cards, { y: 50, opacity: 0 }, {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            }
        });
    }, [forecast.data]);
    if (!forecast.data)
        return null;
    // Data processing
    const list = forecast.data.list.slice(0, 16); // Next 48 hours
    const labels = list.map((item) => format(new Date(item.dt * 1000), 'HH:mm'));
    const tempData = {
        labels,
        datasets: [{
                label: 'Temperature',
                data: list.map((item) => item.main.temp),
                borderColor: 'rgba(79, 139, 255, 1)', // primary
                backgroundColor: 'rgba(79, 139, 255, 0.2)',
                fill: true,
                tension: 0.4
            }]
    };
    const rainData = {
        labels,
        datasets: [{
                label: 'Rain Probability %',
                data: list.map((item) => item.pop * 100),
                backgroundColor: 'rgba(0, 229, 255, 0.8)', // accent
                borderRadius: 4,
            }]
    };
    const windData = {
        labels,
        datasets: [{
                label: 'Wind Speed',
                data: list.map((item) => item.wind.speed),
                borderColor: 'rgba(74, 222, 128, 1)', // success
                backgroundColor: 'rgba(74, 222, 128, 0.1)',
                fill: true,
                tension: 0.4
            }]
    };
    const pressureData = {
        labels,
        datasets: [{
                label: 'Pressure',
                data: list.map((item) => item.main.pressure),
                borderColor: 'rgba(253, 186, 116, 1)', // warning
                tension: 0.4,
                pointRadius: 0
            }]
    };
    return (<div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
      <div className="chart-card glass-panel p-6 h-[300px]">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Temperature Trend</h4>
        <Line options={chartOptions} data={tempData}/>
      </div>
      <div className="chart-card glass-panel p-6 h-[300px]">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Precipitation Chance</h4>
        <Bar options={chartOptions} data={rainData}/>
      </div>
      <div className="chart-card glass-panel p-6 h-[300px]">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Wind Velocity</h4>
        <Line options={chartOptions} data={windData}/>
      </div>
      <div className="chart-card glass-panel p-6 h-[300px]">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Atmospheric Pressure</h4>
        <Line options={chartOptions} data={pressureData}/>
      </div>
    </div>);
};
