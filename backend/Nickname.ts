import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';


export const generateNickname = (): string => {
  const customConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: ' ',
    length: 2,
  };

  return uniqueNamesGenerator(customConfig);
};
