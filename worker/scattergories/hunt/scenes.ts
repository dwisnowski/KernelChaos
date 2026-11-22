import agoraMarket from "./data/agora-market.json";
import airshipDock from "./data/airship-dock.json";
import alpineLodge from "./data/alpine-lodge.json";
import aquariumTunnel from "./data/aquarium-tunnel.json";
import arcticCamp from "./data/arctic-camp.json";
import atticTreasure from "./data/attic-treasure.json";
import bakeryStreet from "./data/bakery-street.json";
import balloonFiesta from "./data/balloon-fiesta.json";
import beachChaos from "./data/beach-chaos.json";
import bookshopMaze from "./data/bookshop-maze.json";
import campingGlade from "./data/camping-glade.json";
import candyKitchen from "./data/candy-kitchen.json";
import carnivalMidway from "./data/carnival-midway.json";
import castleTransylvania from "./data/castle-transylvania.json";
import circusBigTop from "./data/circus-big-top.json";
import coralHarbor from "./data/coral-harbor.json";
import desertOasis from "./data/desert-oasis.json";
import dinosaurMuseum from "./data/dinosaur-museum.json";
import farmHarvest from "./data/farm-harvest.json";
import firehouse from "./data/firehouse.json";
import flowerMarket from "./data/flower-market.json";
import frontierTown from "./data/frontier-town.json";
import grandHotel from "./data/grand-hotel.json";
import iceCreamParlor from "./data/ice-cream-parlor.json";
import jungleTemple from "./data/jungle-temple.json";
import lanternParade from "./data/lantern-parade.json";
import lighthouseKeepers from "./data/lighthouse-keepers.json";
import medievalMarket from "./data/medieval-market.json";
import musicFestival from "./data/music-festival.json";
import pirateCove from "./data/pirate-cove.json";
import pizzaKitchen from "./data/pizza-kitchen.json";
import puppetTheater from "./data/puppet-theater.json";
import rainforestCanopy from "./data/rainforest-canopy.json";
import robotFactory from "./data/robot-factory.json";
import safariPark from "./data/safari-park.json";
import scienceFair from "./data/science-fair.json";
import skatePark from "./data/skate-park.json";
import spacePort from "./data/space-port.json";
import submarineLab from "./data/submarine-lab.json";
import toyWorkshop from "./data/toy-workshop.json";
import trainStation from "./data/train-station.json";
import treehouseVillage from "./data/treehouse-village.json";
import underwaterReefParty from "./data/underwater-reef-party.json";
import vikingLonghouse from "./data/viking-longhouse.json";
import vineyardHarvest from "./data/vineyard-harvest.json";
import volcanoObservatory from "./data/volcano-observatory.json";
import winterMarket from "./data/winter-market.json";
import wizardLibrary from "./data/wizard-library.json";
import yardSale from "./data/yard-sale.json";
import zenGardenFestival from "./data/zen-garden-festival.json";

/** Image-only hunt scene — no answer key; scoring is peer In/Out (ADR 0028 / 0041). */
export interface HuntScene {
  id: string;
  title: string;
  imageUrl: string;
}

/** Cap free-text finds per player per round. */
export const HUNT_MAX_ANSWERS = 40;

interface HuntSceneJson {
  id: string;
  title: string;
  imageUrl: string;
}

function loadScene(raw: HuntSceneJson): HuntScene {
  return {
    id: raw.id,
    title: raw.title,
    imageUrl: raw.imageUrl,
  };
}

export const HUNT_SCENES: HuntScene[] = [
  loadScene(agoraMarket as HuntSceneJson),
  loadScene(airshipDock as HuntSceneJson),
  loadScene(alpineLodge as HuntSceneJson),
  loadScene(aquariumTunnel as HuntSceneJson),
  loadScene(arcticCamp as HuntSceneJson),
  loadScene(atticTreasure as HuntSceneJson),
  loadScene(bakeryStreet as HuntSceneJson),
  loadScene(balloonFiesta as HuntSceneJson),
  loadScene(beachChaos as HuntSceneJson),
  loadScene(bookshopMaze as HuntSceneJson),
  loadScene(campingGlade as HuntSceneJson),
  loadScene(candyKitchen as HuntSceneJson),
  loadScene(carnivalMidway as HuntSceneJson),
  loadScene(castleTransylvania as HuntSceneJson),
  loadScene(circusBigTop as HuntSceneJson),
  loadScene(coralHarbor as HuntSceneJson),
  loadScene(desertOasis as HuntSceneJson),
  loadScene(dinosaurMuseum as HuntSceneJson),
  loadScene(farmHarvest as HuntSceneJson),
  loadScene(firehouse as HuntSceneJson),
  loadScene(flowerMarket as HuntSceneJson),
  loadScene(frontierTown as HuntSceneJson),
  loadScene(grandHotel as HuntSceneJson),
  loadScene(iceCreamParlor as HuntSceneJson),
  loadScene(jungleTemple as HuntSceneJson),
  loadScene(lanternParade as HuntSceneJson),
  loadScene(lighthouseKeepers as HuntSceneJson),
  loadScene(medievalMarket as HuntSceneJson),
  loadScene(musicFestival as HuntSceneJson),
  loadScene(pirateCove as HuntSceneJson),
  loadScene(pizzaKitchen as HuntSceneJson),
  loadScene(puppetTheater as HuntSceneJson),
  loadScene(rainforestCanopy as HuntSceneJson),
  loadScene(robotFactory as HuntSceneJson),
  loadScene(safariPark as HuntSceneJson),
  loadScene(scienceFair as HuntSceneJson),
  loadScene(skatePark as HuntSceneJson),
  loadScene(spacePort as HuntSceneJson),
  loadScene(submarineLab as HuntSceneJson),
  loadScene(toyWorkshop as HuntSceneJson),
  loadScene(trainStation as HuntSceneJson),
  loadScene(treehouseVillage as HuntSceneJson),
  loadScene(underwaterReefParty as HuntSceneJson),
  loadScene(vikingLonghouse as HuntSceneJson),
  loadScene(vineyardHarvest as HuntSceneJson),
  loadScene(volcanoObservatory as HuntSceneJson),
  loadScene(winterMarket as HuntSceneJson),
  loadScene(wizardLibrary as HuntSceneJson),
  loadScene(yardSale as HuntSceneJson),
  loadScene(zenGardenFestival as HuntSceneJson),
];

export function scenesCatalog(): HuntScene[] {
  return HUNT_SCENES.map((s) => ({ ...s }));
}

export function getScene(id: string): HuntScene | undefined {
  return HUNT_SCENES.find((s) => s.id === id);
}

export function isHuntSceneId(v: unknown): v is string {
  return typeof v === "string" && HUNT_SCENES.some((s) => s.id === v);
}

/** Pick a scene, preferring `preferredId` when still unused; else random unused (wrap when exhausted). */
export function pickScene(usedIds: Set<string>, preferredId: string | null): HuntScene {
  const all = HUNT_SCENES;
  if (preferredId) {
    const preferred = all.find((s) => s.id === preferredId);
    if (preferred && !usedIds.has(preferred.id)) {
      return { ...preferred };
    }
  }
  const available = all.filter((s) => !usedIds.has(s.id));
  const pool = available.length > 0 ? available : all;
  const bytes = crypto.getRandomValues(new Uint8Array(1));
  const scene = pool[bytes[0]! % pool.length]!;
  return { ...scene };
}
