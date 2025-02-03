import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-google-charts';
import {
	Card,
	CardContent,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	List,
	ListItem,
	ListItemText,
	Divider, Box
} from '@mui/material';

/**
 * Cost report component with chart and list
 */
const CostReport = ({
						items,
						categoryTotals,
						selectedMonth,
						selectedYear,
						onMonthChange,
						onYearChange
					}) => {
	// Prepare data for Google Chart
	const chartData = [
		['Category', 'Amount'],
		...Object.entries(categoryTotals)
	];

	// Chart options
	const options = {
		title: 'Expenses by Category',
		pieHole: 0.4,
		legend: { position: 'bottom' },
		height: 400
	};

	// Calculate total expenses
	const totalAmount = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

	return (
		<Card sx={{ width: '100%', height: '100%' }}>
			<CardContent>
				<Box sx={{ width: '100%', minWidth: 0}}>
					<Typography variant="h6" gutterBottom>
						Monthly Report
					</Typography>

					<Box sx = {{
						display: 'flex',
						gap: '1rem',
						marginBottom: '1rem',
						flexWrap: 'wrap'
					}}>
						<FormControl style={{ minWidth: 120, flex: '1 1 auto' }}>
							<InputLabel>Month</InputLabel>
							<Select
								value={selectedMonth}
								label="Month"
								onChange={(e) => onMonthChange(e.target.value)}
							>
								{Array.from({ length: 12 }, (_, i) => (
									<MenuItem key={i + 1} value={i + 1}>
										{new Date(2000, i).toLocaleString('default', { month: 'long' })}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl style={{ minWidth: 120, flex: '1 1 auto' }}>
							<InputLabel>Year</InputLabel>
							<Select
								value={selectedYear}
								label="Year"
								onChange={(e) => onYearChange(e.target.value)}
							>
								{Array.from({ length: 5 }, (_, i) => (
									<MenuItem
										key={i}
										value={new Date().getFullYear() - i}
									>
										{new Date().getFullYear() - i}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					{/* Pie Chart */}
					<Box sx={{ width: '100%', overFlow: 'hidden'}}>

						{Object.keys(categoryTotals).length > 0 && (
							<Chart
								chartType="PieChart"
								data={chartData}
								options={options}
								width="100%"
							/>
						)}
					</Box>

					{/* Summary */}
					<Typography variant="h6" gutterBottom style={{ marginTop: '1rem' }}>
						Total Expenses: ${totalAmount.toFixed(2)}
					</Typography>

					{/* Category Breakdown */}
					<List sx={{ width: '100%' }}>
						{Object.entries(categoryTotals).map(([category, amount], index) => (
							<React.Fragment key={category}>
								<ListItem>
									<ListItemText
										primary={category}
										secondary={`$${amount.toFixed(2)} (${((amount/totalAmount)*100).toFixed(1)}%)`}
									/>
								</ListItem>
								{index < Object.entries(categoryTotals).length - 1 && <Divider />}
							</React.Fragment>
						))}
					</List>

					{/* Expenses List */}
					<Typography variant="h6" style={{ marginTop: '2rem' }} gutterBottom>
						Detailed Expenses
					</Typography>
					<List sx={{ width: '100%' }}>
						{items.map((item) => (
							<React.Fragment key={item.id}>
								<ListItem>
									<ListItemText
										primary={item.description}
										secondary={`${item.category} - ${new Date(item.date).toLocaleDateString()}`}
									/>
									<Typography variant="body2">
										${parseFloat(item.amount).toFixed(2)}
									</Typography>
								</ListItem>
								<Divider />
							</React.Fragment>
						))}
					</List>
				</Box>
			</CardContent>
		</Card>
	);
};

CostReport.propTypes = {
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number,
			amount: PropTypes.number,
			category: PropTypes.string,
			description: PropTypes.string,
			date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
		})
	).isRequired,
	categoryTotals: PropTypes.objectOf(PropTypes.number).isRequired,
	selectedMonth: PropTypes.number.isRequired,
	selectedYear: PropTypes.number.isRequired,
	onMonthChange: PropTypes.func.isRequired,
	onYearChange: PropTypes.func.isRequired
};

export default CostReport;