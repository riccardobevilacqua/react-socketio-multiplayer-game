import { uniqueNamesGenerator, Config, adjectives, colors, animals } from 'unique-names-generator';


export const generateNickname = (): string => {
  const customConfig: Config = {
    dictionaries: [adjectives, colors, animals],
    separator: ' ',
  };

  return uniqueNamesGenerator(customConfig);
};
