export class SubscriptionModel {
    public constructor(
        public sub_id: number,
        public subscription: string,
        public sub_type_id: number,
        public is_active: number,
        public payable_amt: number,
        public created_by: number,
        public created_at: Date
    ) { }
}
