export interface Donation {
	username: string;
	message: string;
	amount: number;
	created: string; // ISO string, sort on date
}