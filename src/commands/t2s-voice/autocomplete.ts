import { AutocompleteInteraction } from "discord.js";

export const voices: string[] = [
    "en_us_001",
    "en_us_006",
    "en_us_007",
    "en_us_009",
    "en_us_010",
    "en_uk_001",
    "en_uk_003",
    "en_au_001",
    "en_au_002",
    "fr_001",
    "fr_002",
    "de_001",
    "de_002",
    "es_002",
    "es_mx_002",
    "br_001",
    "br_003",
    "br_004",
    "br_005",
    "id_001",
    "jp_001",
    "jp_003",
    "jp_005",
    "jp_006",
    "kr_002",
    "kr_004",
    "kr_003",
    "en_us_ghostface",
    "en_us_chewbacca",
    "en_us_c3po",
    "en_us_stitch",
    "en_us_stormtrooper",
    "en_us_rocket",
    "en_female_f08_salut_damour",
    "en_male_m03_lobby",
    "en_male_m03_sunshine_soon",
    "en_female_f08_warmy_breeze",
    "en_female_ht_f08_glorious",
    "en_male_sing_funny_it_goes_up",
    "en_male_m2_xhxs_m03_silly",
    "en_female_ht_f08_wonderful_world",
];

export default async function (interaction: AutocompleteInteraction): Promise<void> {
    const focusedValue = interaction.options.getFocused();
    const filtered = voices.filter(voice => voice.includes(focusedValue));
    await interaction.respond(
        filtered.map(voice => ({ name: voice, value: voice })).slice(0, 25),
    );
}