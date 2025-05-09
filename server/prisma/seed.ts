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
        roleId: '2',
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
      {
        id: '7',
        email: 'meshok@gmail.com',
        nickname: 'Meshok',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '8',
        email: 'norizeek@gmail.com',
        nickname: 'norizeek',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '2',
      },
      {
        id: '9',
        email: 'SPlash@gmail.com',
        nickname: 'SPlash',
        password:
          '$2b$10$0bD/1z03VDQP3ko9BJ/2U.FGCyjcyY7sSXaf5.psHwB012H0xBswe',
        isActive: true,
        roleId: '1',
      },
      {
        id: '10',
        email: 'panikaa_@gmail.com',
        nickname: 'panikaa_',
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
        avatar: 'GoneFF.png',
        coverImage: '0.png',
        bio: 'young designer from sp',
        userId: '1',
        points: 152892,
      },
      {
        id: '2',
        avatar: 'ar4iks.png',
        bio: 'young designer from sp',
        userId: '2',
        points: 89324,
      },
      {
        id: '3',
        avatar: 'corobok228.png',
        bio: 'young designer from sp',
        userId: '3',
        points: 24295,
      },
      {
        id: '4',
        avatar: 'gamarjoba.png',
        bio: 'young designer from sp',
        userId: '4',
        points: 5769,
      },
      {
        id: '5',
        avatar: '6g6.png',
        bio: 'young designer from sp',
        userId: '5',
        points: 7769,
      },
      {
        id: '6',
        avatar: '1.png',
        bio: 'young designer from sp',
        userId: '6',
      },
      {
        id: '7',
        avatar: '1.png',
        bio: 'young designer from sp',
        userId: '7',
      },
      {
        id: '8',
        avatar: 'norizeek.png',
        bio: 'young designer from sp',
        userId: '8',
        points: 93295,
      },
      {
        id: '9',
        avatar: 'SPlash.png',
        bio: 'young designer from sp',
        userId: '9',
      },
      {
        id: '10',
        avatar: '1.png',
        bio: 'young designer from sp',
        userId: '10',
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
        avatarImg: '0.png',
      },
      {
        id: '2',
        name: 'xmindmemories',
        avatarImg: '2.png',
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
        authorId: '2',
        authorTypeId: '2',
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
        publishDate: new Date('2024-09-27').toISOString(),
        title: 'всегда ненавидел быть слабым',
        img: '1.png',
        releaseTypeId: '1',
      },
      {
        id: '2',
        publishDate: new Date('2024-04-26').toISOString(),
        title: 'тебе жаль это слышать, Ч. 2',
        img: '2.png',
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
      {
        releaseId: '2',
        authorId: '1',
      },
    ],
  });

  await prisma.releaseProducer.createMany({
    data: [
      {
        releaseId: '1',
        authorId: '2',
      },
      {
        releaseId: '2',
        authorId: '2',
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
      // ------------------------------- 1
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
      {
        id: '7',
        releaseId: '1',
        userId: '7',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        id: '8',
        releaseId: '1',
        userId: '8',
        rhymes: 10,
        structure: 10,
        realization: 10,
        individuality: 10,
        atmosphere: 10,
        total: 90,
        title: 'Красота в Слабости',
        text: 'От релиза я получил максимальное удовольствие. По ходу прослушивания, я начал больше знать Женю как человека. Сам артист сказал вникать в текст релиза, а не в сам звук. Выливая всю душу, артист сталкивался со многими проблемами. В релизе я выявил что Карти рассказывал о своей истории жизни, о взглядах на жизнь, о несостоявшихся любовных историй, о взрослении. Слабость артиста в пластинке проявляется как прогрессия. Со всеми слабостями артист смог разрешить и по ходу релиза становится всё сильнее-сильнее.',
        createdAt: new Date(Date.now() - 26 * 3600 * 1000),
      },
      {
        id: '9',
        releaseId: '1',
        userId: '9',
        rhymes: 10,
        structure: 9,
        realization: 10,
        individuality: 8,
        atmosphere: 10,
        total: 83,
        title: 'Открытие года!',
        text: 'Даже не знаю с чего начать.\nЭмоции и чувства которые я получил от прослушивания данного релиза могут равняться только с альбомом Майота «Оба».\nКачество на высоте, ритмика прекрасна, звук потрясающий правда.\nРешил послушать альбом чисто из-за высокой оценки Фломастера и готов сказать что оценка полностью оправдывает себя.\nДля меня лично этот альбом забрал осень и зиму, вайб 11/10.\nС радостью ознакомлюсь с прошлыми работами этого автора и буду следить за его творчеством.\nУверен что сможет забрать звание «Открытие года» себе.',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        id: '10',
        releaseId: '1',
        userId: '10',
        rhymes: 9,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 81,
        title: 'Как же он чувствует',
        text: 'До этого альбома никогда не слышал творчество cold carti, но после прослушивания понял почему многим людям нравится его творчество. Безумная атмосфера и жизненный сторитейлинг прослеживается во всем альбоме, каждый трек перетекает в следующий что делает его безумно целостным и концептуальный. Обязательно к ознакомлению!',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      // ------------------------------- 2
      {
        id: '11',
        releaseId: '2',
        userId: '1',
        rhymes: 8,
        structure: 9,
        realization: 9,
        individuality: 9,
        atmosphere: 10,
        total: 79,
        title: 'На голову выше первой части',
        text: 'Спустя чуть больше года выходит вторая часть прекрасного релиза. Здесь артист уже нарастил свои способности и показывает более детально проработанную работу чем раньше. Видно старания артиста и за это хочется просто сказать спасибо. Давайте подробнее к оценкам: Рифмы / Образы - 8: Текст стал чуть лучше, но не настолько, чтобы ставить ему 9 или 10. Просто более укреплённый чем раньше, вот и всё. Нельзя сказать что он плохой, местами очень интересный и запоминающийся, но только местами к сожалению. \n\nСтруктура / Ритмика - 9: Здесь артист вырос и показывает более проработанную структуру. Артист всё так же хорошо читает и к той же ритмике нет вопросов. Душноты в треках не заметил да и хронометраж не даёт сильно душнить.\n\nРеализация стиля - 9: Биты стали ещё краше и более проработанные. Конечно есть куда расти, но оцениваем мы конкретно этот релиз и тут оценка 9. Сведос очень хороший и артиста слышно хорошо.\n\nИндивидуальность / харизма - 9: Видно что он поработал над собой и стал выдавать всё более интересный материал, и как можно понять, превратился в более необычного артиста.\n\nАтмосфера / вайб - 10: Этот релиз мне очень нравится. Он не даёт тебе заскучать ведь каждый трек выполнен по разному и оставляет необычные ощущения. При этом в каждом треке, лично для меня, присутствует спокойствие, которое наполняет меня при прослушивании.\n\nВ итоге хочу сказать, что артист большой молодец. Вырос во всех аспектах и показывает всё более интересные работы. И как показывает настоящее, он хочет развиваться и показывать слушателям всё более интересный материал.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '12',
        releaseId: '2',
        userId: '2',
        rhymes: 9,
        structure: 10,
        realization: 9,
        individuality: 8,
        atmosphere: 10,
        total: 81,
        title: 'Умеет красиво изложить',
        text: 'Звучит сильнее первой части и это очень хорошо заметно.\n\nРифмы/образы (9) – текст в большой часьи очень хорош, невозможно найти места, где текст очень, даже если есть просадки, то они не очень заметны происходящие, душных повторений как мне - нет, но многие считают, что из-за долгих припевов звучит душно, но не соглашусь, ведь они больше всего погружают в атмосфера продолжения и самого трека.\n\nСтруктура/Ритмика (10) - она идеальна, кто-то хочет поспорить? Структура не скучная и ритмика не даёт заскучать, поэтому тут смело можно ставить 10 без сомнений или вопросов. До чего только можно докопаться это только до очень долгих ожиданий следующего парта, либо припева.\n\nРеализация стиля (9) - потому что есть до чего можна придраться и найти моменты, где есть что-то не то, чего не хватает, возможно я сильно ошибаюсь и могу быть не прав в данный момент, но я лично считаю, что 9 тут будет 100% твёрдая, но никаким образом не 10.\n\nИндивидуальность/харизма - (8) возможно снова не прав, но она есть сама харизма, но немного не та, которую хотелось ожидать.Треки идеальны по всем категориям, но минусы найти можна, если послушать это намного больше раз, чем один или два раза.\n\nКак фанат могу сказать, что это не провал, но не успех, но очень сильная и крепкая работа. Но также претендовать на что-то большее пока что не может.\n\nЖдём дальнейших работ, таких же сильных и крепких.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
      {
        id: '13',
        releaseId: '2',
        userId: '3',
        rhymes: 5,
        structure: 5,
        realization: 5,
        individuality: 5,
        atmosphere: 1,
        total: 28,
        createdAt: new Date(Date.now() - 1 * 3600 * 1000),
      },
    ],
  });

  await prisma.userFavRelease.createMany({
    data: [
      // ------------------------------- 1
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

      // ------------------------------- 2
      {
        releaseId: '2',
        userId: '1',
      },
      {
        releaseId: '2',
        userId: '2',
      },
    ],
  });

  await prisma.userFavReview.createMany({
    data: [
      // ------------------------------- 1
      {
        reviewId: '8',
        userId: '1',
      },
      {
        reviewId: '2',
        userId: '1',
      },

      // ------------------------------- 2
      {
        reviewId: '1',
        userId: '2',
      },
      {
        reviewId: '8',
        userId: '2',
      },

      // ------------------------------- 3
      {
        reviewId: '8',
        userId: '3',
      },

      // ------------------------------- 4
      {
        reviewId: '1',
        userId: '4',
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
