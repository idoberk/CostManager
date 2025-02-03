import { useState, useEffect } from 'react';
import { Container, Snackbar, Alert, Grid } from '@mui/material';
import CostForm from './components/CostManager.jsx';
import CostReport from './components/CostChart.jsx';
import costManagerUtils from './lib/idb.js';

const App = () => {
	// Database instance
	const [db, setDB] = useState(null);
	const [formData, setFormData] = useState({
		amount: '',
		category: '',
		description: '',
		date: new Date().toISOString().split('T')[0]
	});

	// Report state
	const [items, setItems] = useState([]);
	const [categoryTotals, setCategoryTotals] = useState({});
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	// Feedback state
	const [feedback, setFeedback] = useState({
		open: false,
		message: '',
		severity: 'success'
	});

	// Initialize database
	useEffect(() => {
		const initDatabase = async () => {
			try {
				const dbInstance = new costManagerUtils.Database();
				await dbInstance.initDatabase();
				setDB(dbInstance);
			} catch (error) {
				setFeedback({
					open: true,
					message: error.message,
					severity: 'error'
				});
			}
		};

		initDatabase();
	}, []);

	// Load report data
	useEffect(() => {
		const loadReportData = async () => {
			if (db) {
				try {
					const monthItems = await db.getMonthlyCosts(selectedMonth, selectedYear);
					setItems(monthItems);

					const totals = await db.getCategoryTotals(selectedMonth, selectedYear);
					setCategoryTotals(totals);
				} catch (error) {
					setFeedback({
						open: true,
						message: error.message,
						severity: 'error'
					});
				}
			}
		};

		loadReportData();
	}, [db, selectedMonth, selectedYear]);

	/**
	 * Handles form submission
	 * @param {Event} event - Form event
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!db) {
			setFeedback({
				open: true,
				message: 'Database not initialized',
				severity: 'error'
			});
			return;
		}

		try {
			// Prepare the data
			const costData = {
				...formData,
				amount: parseFloat(formData.amount),
				date: new Date(formData.date)
			};

			// Save to database
			await db.addCostItem(costData);

			// Reload report data
			const monthItems = await db.getMonthlyCosts(selectedMonth, selectedYear);
			setItems(monthItems);

			const totals = await db.getCategoryTotals(selectedMonth, selectedYear);
			setCategoryTotals(totals);

			// Show success message
			setFeedback({
				open: true,
				message: 'Cost item added successfully',
				severity: 'success'
			});

			// Reset form
			setFormData({
				amount: '',
				category: '',
				description: '',
				date: new Date().toISOString().split('T')[0]
			});
		} catch (error) {
			setFeedback({
				open: true,
				message: error.message,
				severity: 'error'
			});
		}
	};

	const handleFeedbackClose = () => {
		setFeedback({ ...feedback, open: false });
	};

	return (
		<Container maxWidth='lg' sx={{ marginTop: '2rem', display: 'flex', minHeight: '100vh' }}>
			<Grid container spacing={3} sx={{ width: '100%', margin: 0}}>
				<Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column'}}>
					<CostForm
						formData={formData}
						setFormData={setFormData}
						onSubmit={handleSubmit}
					/>
				</Grid>
				<Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column'}}>
					<CostReport
						items={items}
						categoryTotals={categoryTotals}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						onMonthChange={setSelectedMonth}
						onYearChange={setSelectedYear}
					/>
				</Grid>
			</Grid>

			<Snackbar
				open={feedback.open}
				autoHideDuration={6000}
				onClose={handleFeedbackClose}
			>
				<Alert
					onClose={handleFeedbackClose}
					severity={feedback.severity}
					sx={{ width: '100%' }}
				>
					{feedback.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default App;