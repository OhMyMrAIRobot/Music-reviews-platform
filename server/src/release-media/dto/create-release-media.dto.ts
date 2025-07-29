export class CreateReleaseMediaDto {
  title: string;
  url: string;
  releaseId: string;
  userId?: string;
  releaseMediaTypeId: string;
  releaseMediaStatusId: string;
}
