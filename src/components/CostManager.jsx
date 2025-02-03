import {
	Button,
	Card,
	CardContent,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from "@mui/material";
import { useState } from "react";



const CATEGORIES = ['Housing', 'Food', 'Shopping', 'Transportation', 'Entertainment', 'Other'];

/* eslint-disable react/prop-types */

const CostsForm = ({ formData, setFormData, onSubmit}) => {
	const [amountError, setAmountError] = useState('');
	const handleSubmit = (e) => {
		e.preventDefault();

		const amount = parseFloat(formData.amount);
		if (amount <= 0) {
			setAmountError('Amount must be greater than 0');
			return;
		}

		setAmountError('');
		onSubmit(e);
	};

	const handleAmountChange = (e) => {
		const value = e.target.value;
		setFormData({
			...formData,
			amount: value
		});

		if (amountError) {
			setAmountError('');
		}
	}
	return (
		<Card sx={{ width: '100%' }}>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Add New Cost
				</Typography>

				<form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
					<TextField
						label='Amount'
						type='number'
						value={formData.amount}
						onChange={handleAmountChange}
						error={!!amountError}
						helperText={amountError}
						required
						fullWidth
					/>

					<FormControl fullWidth>
						<InputLabel>Category</InputLabel>
						<Select
							value={formData.category}
							label='Category'
							onChange={(e) => setFormData({
								...formData,
								category: e.target.value
							})}
							required
						>
							{CATEGORIES.map((category) => (
								<MenuItem
									key={category}
									value={category}
								>
									{category}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label='Description'
						value={formData.description}
						onChange={(e) => setFormData({
							...formData,
							description: e.target.value
						})}
						required
						fullWidth
					/>

					<TextField
						type='date'
						label='Date'
						value={formData.date}
						onChange={(e) => setFormData({
							...formData,
							date: e.target.value
						})}
						required
						fullWidth
					/>
					
					<Button
						type='submit'
						variant='contained'
						color='primary'
						fullWidth
					>
						Add Cost
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default CostsForm;