import { PrismaClient } from '@prisma/client';
import { AuthorTypesEnum } from '../src/author-types/entities/author-types.enum';
import { ReleaseRatingTypesEnum } from '../src/release-rating-types/entities/release-rating-types.enum';
import { ReleaseTypesEnum } from '../src/release-types/entities/release-types.enum';
import { UserRoleEnum } from '../src/roles/types/user-role.enum';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        id: '4',
        role: UserRoleEnum.ROOT_ADMIN,
      },
      {
        id: '3',
        role: UserRoleEnum.ADMIN,
      },
      {
        id: '2',
        role: UserRoleEnum.SUPER_USER,
      },
      {
        id: '1',
        role: UserRoleEnum.USER,
      },
    ],
  });

  await prisma.user.createMany({
    data: [
      {
        id: '1',
        email: 'GoneFF@gmail.com',
        nickname: 'GoneFF',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '2',
        email: 'ar4iks@gmail.com',
        nickname: 'ar4iks',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '3',
        email: 'corobok228@gmail.com',
        nickname: 'corobok228',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '4',
        email: 'Gamarjoba@gmail.com',
        nickname: 'Gamarjoba',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '5',
        email: '6g6@gmail.com',
        nickname: '6g6',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '6',
        email: 'ChebuR@gmail.com',
        nickname: 'ChebuR',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
    ],
  });

  await prisma.userProfile.createMany({
    data: [
      {
        id: '1',
        avatar: '',
        coverImage: '',
        bio: 'young designer from sp',
        userId: '1',
      },
      {
        id: '2',
        avatar: '',
        coverImage: '',
        bio: 'young designer from sp',
        userId: '2',
      },
      {
        id: '3',
        avatar: '',
        coverImage: '',
        bio: 'young designer from sp',
        userId: '3',
      },
      {
        id: '4',
        avatar: '',
        coverImage: '',
        bio: 'young designer from sp',
        userId: '4',
      },
      {
        id: '5',
        avatar: '',
        coverImage: '',
        bio: 'young designer from sp',
        userId: '5',
      },
      {
        id: '6',
        avatar: '',
        coverImage: '',
        bio: 'young designer from sp',
        userId: '6',
      },
    ],
  });

  await prisma.releaseType.createMany({
    data: [
      {
        id: '1',
        type: ReleaseTypesEnum.ALBUM,
      },
      {
        id: '2',
        type: ReleaseTypesEnum.MULTISINGLE,
      },
      {
        id: '3',
        type: ReleaseTypesEnum.SINGLE,
      },
    ],
  });

  await prisma.authorType.createMany({
    data: [
      {
        id: '1',
        type: AuthorTypesEnum.ARTIST,
      },
      {
        id: '2',
        type: AuthorTypesEnum.PRODUCER,
      },
      {
        id: '3',
        type: AuthorTypesEnum.DESIGNER,
      },
    ],
  });

  await prisma.author.createMany({
    data: [
      {
        id: '1',
        name: 'Cold carti',
      },
      {
        id: '2',
        name: 'Криспи',
      },
      {
        id: '3',
        name: 'Kizaru',
      },
      {
        id: '4',
        name: 'Markul',
      },
      {
        id: '5',
        name: 'Heronwater',
      },
    ],
  });

  await prisma.authorOnType.createMany({
    data: [
      {
        authorId: '1',
        authorTypeId: '1',
      },
      {
        authorId: '1',
        authorTypeId: '2',
      },
      {
        authorId: '2',
        authorTypeId: '1',
      },
      {
        authorId: '3',
        authorTypeId: '1',
      },
      {
        authorId: '4',
        authorTypeId: '1',
      },
      {
        authorId: '5',
        authorTypeId: '1',
      },
    ],
  });

  await prisma.release.createMany({
    data: [
      {
        id: '1',
        year: 2024,
        title: 'всегда ненавидел быть слабым',
        img: 'https://avatars.yandex.net/get-music-content/14247687/1fc41d7b.a.33447815-1/m1000x1000',
        releaseTypeId: '1',
      },
    ],
  });

  await prisma.releaseArtist.createMany({
    data: [
      {
        releaseId: '1',
        authorId: '1',
      },
    ],
  });

  await prisma.releaseProducer.createMany({
    data: [
      {
        releaseId: '1',
        authorId: '1',
      },
    ],
  });

  await prisma.releaseRatingType.createMany({
    data: [
      {
        id: '1',
        type: ReleaseRatingTypesEnum.NO_TEXT,
      },
      {
        id: '2',
        type: ReleaseRatingTypesEnum.WITH_TEXT,
      },
      {
        id: '3',
        type: ReleaseRatingTypesEnum.SUPER_USER,
      },
    ],
  });

  await prisma.review.createMany({
    data: [
      {
        id: '1',
        releaseId: '1',
        userId: '1',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Глубоко на понятном',
        text: 'сейчас в себе🖤 — Прекрасное открытие альбома, которое уже заявляет нам о том, что нас ожидает интересный инструментал, красивый и глубоко пропитанный смыслом текст, а также интересная подача. В тексте конкретно этого трека есть несколько строчек, которые я готов размещать в своих соц сетях в качестве описания, потому что они звучат слишком красиво и лаконично. Многообещающе',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '2',
        releaseId: '1',
        userId: '2',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 9,
        atmosphere: 10,
        total: 88,
        title: 'Становление большим артистом',
        text: 'Слежу за Женей уже года два, и радуюсь, что о нем узнает все больше людей. Очень ждал этот альбом, потому что прошлые ep засели в плейлист надолго, я ждал полноценный альбом; и бах выходит пререлиз в виде «музыка и счастье», после прослушивания которого, я был в предвкушении.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        id: '3',
        releaseId: '1',
        userId: '3',
        rhymes: 7,
        structure: 7,
        realization: 8,
        individuality: 7,
        atmosphere: 8,
        total: 60,
        title: 'Крайне неоднозначно',
        text: '•Сейчас в себе - хороший трек, задающий тенденцию последующего звучания альбома и примитивизма текстовой составляющей\n• постоянно - один из показательных треков альбома,выпячивающий,как по мне,откровенную лень в отношении работы с текстами. Карти может невелировать однобокость и простоту текстов аудио составляющей,но когда припевы трека состоят из повторении одной фразы,сложно сделать так,чтобы он не приелся слушателю спустя пары тройки десятков секунд прослушивания ( В детстве не любил качели, но сейчас они меня догнали)\n• всё тебе радо - хороший лиричный трек уже в его хорошо освоенном стиле. Трек для прогулки летним вечером. Припев напомнил мне лиричность Басты,и такие намётки не могут не радовать,если честно.',
        createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      },
      {
        id: '4',
        releaseId: '1',
        userId: '4',
        rhymes: 10,
        structure: 9,
        realization: 9,
        individuality: 10,
        atmosphere: 10,
        total: 86,
        title: 'Карти вырос',
        text: 'Только что дослушал альбом и хочу поделиться впечатлениями.\n\nСам Карти сказал, что это альбом скорее ради текста, нежели звука, и это очень хорошо описывает 1-ю половину альбома. Во второй же половине и звучание, и рифмы становятся куда интереснее.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        id: '5',
        releaseId: '1',
        userId: '5',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Музыкальная терапия',
        text: 'Женя Cold Carti стал для меня ярчайшим открытием 2023 года с его альбомом "Тебе жаль это слышать", забравший себе значительную часть хронометража в моих плейлистах. Для меня он стал тем артистом, к творчеству которого я могу обратится в любой момент своей жизни.\n\nХочу начать сразу с минуса, но это минус на который абсолютно никто не обратит внимания - ощущение того, насколько быстро пролетают 10 треков. Каждый трек это безумно искренняя история, в которую веришь, в которой переживаешь и в голове "как же ... это жизненно". На этом минусы альбома заканчиваются. Реализация 9 ( в голове 10 ).\n\nТекст 10 и это невозможно отрицать. Неописуемо красивые строки, неуходящие от главной темы альбома - саморефлексии.',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000),
      },
      {
        id: '6',
        releaseId: '1',
        userId: '6',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Да это же 90!',
        text: 'Для меня это первый настоящий альбом Cold carti! Альбом который послушают к сожалению немногие и это очень грустно, ведь этот альбом заслуживает внимания! Это топовый уровень, Жень!\nНачну с того, что это самая качественная работа Карти, это эталон альбомов! Для меня настоящий альбом должен выглядеть именно так!\nЯ считаю главное, чем может похвастаться данный альбом, это развитие! От начала до конца мы вместе с артистом проживаем историю. В релизе есть завязка, где артист рассказывает как ему сейчас плохо, делится своими чувствами и переживаниями, развитие, сильнейшая кульминация в центральном треке "музыка или счастье" прекрасная развязка где артист отпускает все свое прошлое и меняется в лучшую или худшую сторону и концовка, в которой герой полностью переосознает этот мир, переосознает себя и отношения.\nСдержанное количество треков, это даже не минус в данном релизе, если бы их было больше, думаю во время прослушивания могла б потеряться та нить, которая тянется из трека в трек.',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
    ],
  });

  await prisma.userFavRelease.createMany({
    data: [
      {
        releaseId: '1',
        userId: '1',
      },
      {
        releaseId: '1',
        userId: '2',
      },
      {
        releaseId: '1',
        userId: '4',
      },
    ],
  });

  await prisma.userFavReview.createMany({
    data: [
      {
        reviewId: '1',
        userId: '1',
      },
      {
        reviewId: '1',
        userId: '2',
      },
      {
        reviewId: '1',
        userId: '4',
      },
      {
        reviewId: '2',
        userId: '1',
      },
      {
        reviewId: '2',
        userId: '2',
      },
    ],
  });

  // const reviews = await prisma.review.findMany(); // Получаем все отзывы

  // for (const review of reviews) {
  //   await prisma.review.update({
  //     where: { id: review.id },
  //     data: { id: review.id }, // Обновляем, не меняя значение
  //   });
  // }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
