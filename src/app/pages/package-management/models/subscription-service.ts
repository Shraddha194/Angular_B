export class SubscriptionService {
  public constructor(
    public sub_id: number,
    public service_id: number,
    public is_active: number,
    public created_by: number,
    public created_at: Date
  ) {}
}
