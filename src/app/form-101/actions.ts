"use server";
import { actionRequest } from '@/lib/utils/actionRequest';


export async function getForm101(props: { model: string; model_id: string }) {
	return actionRequest({
		method: "get",
		url: `/procurement/form101/retrieve/?m=${props.model}&i=${props.model_id}`,
	});
}
