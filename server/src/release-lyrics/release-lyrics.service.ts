import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReleaseLyrics } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { extractLyrics } from 'src/lib/lyrics/extract-lyrics';
import { searchGeniusSong } from 'src/lib/lyrics/search-genius-song';
import { ReleaseTypesEnum } from 'src/release-types/types/release-types.enum';
import { ReleasesService } from 'src/releases/releases.service';

@Injectable()
export class ReleaseLyricsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly releasesService: ReleasesService,
  ) {}

  /**
   * Get lyrics for a release by id.
   *
   * - Throws ConflictException when the release type does not support lyrics.
   * - Returns existing lyrics from DB if present.
   * - Otherwise searches Genius, extracts lyrics and saves them.
   *
   * @param {string} id - Release id
   * @returns {Promise<ReleaseLyrics>} The persisted lyrics record
   * @throws {ConflictException} If release type is not SINGLE
   * @throws {NotFoundException} If lyrics cannot be found or extracted
   */
  async findOne(id: string): Promise<ReleaseLyrics> {
    const release = await this.releasesService.findById(id);

    if (release.releaseType.type !== ReleaseTypesEnum.SINGLE) {
      throw new ConflictException(
        `Lyrics are not avaliable for this release type`,
      );
    }

    const existingLyrics = await this.loadFromDatabase(id);

    if (existingLyrics) {
      return existingLyrics;
    }

    const options = {
      title: release.title,
      artists: release.authors.artists.map((artist) => artist.name),
    };

    const songUrl = await searchGeniusSong(options);

    if (!songUrl) {
      throw new NotFoundException(`Lyrics for this release not found.`);
    }
    const lyrics = await extractLyrics(songUrl);

    if (!lyrics) {
      throw new NotFoundException(`Lyrics for this release not found.`);
    }

    return this.saveToDatabase(id, lyrics.trim());
  }

  /**
   * Load lyrics record from the database for a given release id.
   *
   * @param {string} releaseId - ID of the release
   * @returns {Promise<ReleaseLyrics | null>} The lyrics record or null if not found
   */
  async loadFromDatabase(releaseId: string): Promise<ReleaseLyrics | null> {
    const lyrics = await this.prisma.releaseLyrics.findUnique({
      where: { releaseId },
    });

    return lyrics;
  }

  /**
   * Upsert lyrics for a release.
   * If a record exists - update it; otherwise create a new one.
   *
   * @param {string} releaseId - ID of the release
   * @param {string} lyrics - Extracted lyrics text
   * @returns {Promise<ReleaseLyrics>} The upserted lyrics record
   */
  async saveToDatabase(
    releaseId: string,
    lyrics: string,
  ): Promise<ReleaseLyrics> {
    return this.prisma.releaseLyrics.upsert({
      where: { releaseId },
      update: { lyrics },
      create: { releaseId, lyrics },
    });
  }
}
