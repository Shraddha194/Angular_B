export class ImageModel {
    public constructor(public hotel_id: number,
        public image_path: File,
        public created_by: number,
        public created_at: Date) {

    }
}
