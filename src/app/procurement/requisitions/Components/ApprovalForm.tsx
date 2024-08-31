import React from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/Components/ui/select';


export default function ApprovalForm() {
	return (
		<div>
			<div className="grid gap-4">
				<div className="grid gap-2">
					<Label>Approve</Label>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select an option" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="1">Yes</SelectItem>
								<SelectItem value="2">No</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
