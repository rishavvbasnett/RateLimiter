import type { UserDocument, UserDto } from "./users.types.js";

export function mapToDto(userDocument: UserDocument): UserDto {
  return {
    username: userDocument.username,
  };
}
