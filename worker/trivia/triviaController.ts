import { generateChaosDash, type ChaosDashPuzzle } from "./chaosDash.ts";
import {
  buildLiveBoard,
  cellIndex,
  dailyWagerMax,
  remainingCellCount,
  shuffleChoices,
  toPublicBoard,
  type TriviaLiveBoard,
} from "./board.ts";
import { getTriviaPack } from "./packs.ts";
import {
  DEFAULT_TRIVIA_CHAOS_MODE,
  DEFAULT_TRIVIA_PACK,
  TRIVIA_ANSWER_MS,
  TRIVIA_BETWEEN_MS,
  TRIVIA_BLINDFOLD_MS,
  TRIVIA_BUZZ_JAM_MS,
  TRIVIA_BUZZ_SYNC_MS,
  TRIVIA_CHAOS_DASH_LOCK_MS,
  TRIVIA_CELL_HIGHLIGHT_MS,
  TRIVIA_CLUE_READ_MS,
  TRIVIA_DAILY_WAGER_MIN,
  TRIVIA_DD_REVEAL_MS,
  TRIVIA_FINAL_ANSWER_MS,
  TRIVIA_FINAL_CATEGORY_MS,
  TRIVIA_FINAL_WAGER_MS,
  TRIVIA_HINT_TAX,
  TRIVIA_REVEAL_MS,
  TRIVIA_SCREEN_ZAP_MS,
  chaosChargeCap,
  isTriviaChaosMode,
  isTriviaChaosPower,
  isTriviaPackId,
  normalizeTriviaPackId,
  powersForMode,
  type TriviaChaosMode,
  type TriviaClueStage,
  type TriviaLastOutcome,
  type TriviaPackId,
  type TriviaPhase,
  type TriviaRoomState,
  type TriviaRound,
} from "./protocol.ts";
import {
  applyCorrect,
  applyFinal,
  applyWrong,
  cheerBonusFromMeter,
  pickWinners,
} from "./scoring.ts";

export interface TriviaSeat {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  chaosCharges: number;
  finalWager: number | null;
  finalAnswered: boolean;
}

export interface TriviaPersisted {
  packId: TriviaPackId;
  chaosMode: TriviaChaosMode;
  phase: TriviaPhase;
  round: TriviaRound | null;
  liveBoard: TriviaLiveBoard | null;
  controllerId: string | null;
  activeCategoryIndex: number | null;
  activeTier: number | null;
  activeValue: number | null;
  activePrompt: string | null;
  activeCategoryTitle: string | null;
  clueStage: TriviaClueStage | null;
  isDailyDouble: boolean;
  shuffledChoices: string[] | null;
  correctChoiceIndex: number | null;
  selectedChoiceIndex: number | null;
  buzzedPlayerId: string | null;
  buzzLockSeq: number;
  buzzOpenAt: number | null;
  lockedOutIds: string[];
  endsAt: number | null;
  dailyWager: number | null;
  dailyWagerMax: number | null;
  finalCategory: string | null;
  finalPrompt: string | null;
  finalChoices: string[] | null;
  finalCorrectIndex: number | null;
  pot: number;
  chaosDash: ChaosDashPuzzle | null;
  chaosDashWinnerId: string | null;
  chaosWinSeq: number;
  lastOutcome: TriviaLastOutcome;
  lastOutcomePlayerId: string | null;
  lastOutcomePlayerName: string | null;
  blindfoldUntil: number | null;
  screenZapUntil: number | null;
  fakeBuzzPlayerId: string | null;
  spotlightPlayerId: string | null;
  buzzJamUntil: Record<string, number>;
  cheerScore: number;
  hintExcluded: number[];
  phoneFriendVotes: Record<string, number>;
  trapChoiceIndex: number | null;
  allianceIds: string[] | null;
  hotSeatPlayerId: string | null;
  challengeOpen: boolean;
  challengeVotes: Record<string, boolean>;
  lastScoreDelta: number | null;
  pendingPartyTax: boolean;
  swapStakesActive: boolean;
  winners: string[];
  seats: TriviaSeat[];
  alarmKind?:
    | "highlightToReveal"
    | "clueToBuzz"
    | "answerTimeout"
    | "revealDone"
    | "betweenDone"
    | "ddRevealDone"
    | "finalCategoryDone"
    | "finalWagerTimeout"
    | "finalAnswerTimeout"
    | null;
}

type AlarmKind =
  | "highlightToReveal"
  | "clueToBuzz"
  | "answerTimeout"
  | "revealDone"
  | "betweenDone"
  | "ddRevealDone"
  | "finalCategoryDone"
  | "finalWagerTimeout"
  | "finalAnswerTimeout"
  | null;

export class TriviaController {
  packId: TriviaPackId = DEFAULT_TRIVIA_PACK;
  chaosMode: TriviaChaosMode = DEFAULT_TRIVIA_CHAOS_MODE;
  phase: TriviaPhase = "lobby";
  round: TriviaRound | null = null;
  liveBoard: TriviaLiveBoard | null = null;
  controllerId: string | null = null;
  activeCategoryIndex: number | null = null;
  activeTier: number | null = null;
  activeValue: number | null = null;
  activePrompt: string | null = null;
  activeCategoryTitle: string | null = null;
  clueStage: TriviaClueStage | null = null;
  isDailyDouble = false;
  shuffledChoices: string[] | null = null;
  correctChoiceIndex: number | null = null;
  selectedChoiceIndex: number | null = null;
  buzzedPlayerId: string | null = null;
  buzzLockSeq = 0;
  buzzOpenAt: number | null = null;
  lockedOutIds: string[] = [];
  endsAt: number | null = null;
  dailyWager: number | null = null;
  dailyWagerMaxVal: number | null = null;
  finalCategory: string | null = null;
  finalPrompt: string | null = null;
  finalChoices: string[] | null = null;
  finalCorrectIndex: number | null = null;
  pot = 0;
  chaosDash: ChaosDashPuzzle | null = null;
  chaosDashWinnerId: string | null = null;
  chaosWinSeq = 0;
  lastOutcome: TriviaLastOutcome = null;
  lastOutcomePlayerId: string | null = null;
  lastOutcomePlayerName: string | null = null;
  blindfoldUntil: number | null = null;
  screenZapUntil: number | null = null;
  fakeBuzzPlayerId: string | null = null;
  spotlightPlayerId: string | null = null;
  buzzJamUntil: Record<string, number> = {};
  cheerScore = 0;
  hintExcluded: number[] = [];
  phoneFriendVotes: Record<string, number> = {};
  trapChoiceIndex: number | null = null;
  allianceIds: string[] | null = null;
  hotSeatPlayerId: string | null = null;
  challengeOpen = false;
  challengeVotes: Record<string, boolean> = {};
  lastScoreDelta: number | null = null;
  pendingPartyTax = false;
  swapStakesActive = false;
  winners: string[] = [];
  seats = new Map<string, TriviaSeat>();
  alarmKind: AlarmKind = null;
  private chaosDashLocks = new Map<string, number>();

  resetLobbyKeepSeats(): void {
    this.phase = "lobby";
    this.round = null;
    this.liveBoard = null;
    this.controllerId = null;
    this.clearClue();
    this.endsAt = null;
    this.finalCategory = null;
    this.finalPrompt = null;
    this.finalChoices = null;
    this.finalCorrectIndex = null;
    this.pot = 0;
    this.chaosDash = null;
    this.chaosDashWinnerId = null;
    this.lastOutcome = null;
    this.lastOutcomePlayerId = null;
    this.lastOutcomePlayerName = null;
    this.clearFx();
    this.winners = [];
    this.alarmKind = null;
    for (const s of this.seats.values()) {
      s.score = 0;
      s.chaosCharges = 0;
      s.finalWager = null;
      s.finalAnswered = false;
    }
  }

  private clearClue(): void {
    this.activeCategoryIndex = null;
    this.activeTier = null;
    this.activeValue = null;
    this.activePrompt = null;
    this.activeCategoryTitle = null;
    this.clueStage = null;
    this.isDailyDouble = false;
    this.shuffledChoices = null;
    this.correctChoiceIndex = null;
    this.selectedChoiceIndex = null;
    this.buzzedPlayerId = null;
    this.buzzOpenAt = null;
    this.lockedOutIds = [];
    this.dailyWager = null;
    this.dailyWagerMaxVal = null;
    this.chaosDash = null;
    this.chaosDashWinnerId = null;
    this.cheerScore = 0;
    this.hintExcluded = [];
    this.phoneFriendVotes = {};
    this.trapChoiceIndex = null;
    this.challengeOpen = false;
    this.challengeVotes = {};
    this.lastScoreDelta = null;
    this.pendingPartyTax = false;
    this.swapStakesActive = false;
    this.chaosDashLocks.clear();
  }

  private clearFx(): void {
    this.blindfoldUntil = null;
    this.screenZapUntil = null;
    this.fakeBuzzPlayerId = null;
    this.spotlightPlayerId = null;
    this.buzzJamUntil = {};
  }

  syncSeatsFrom(
    players: Iterable<{ id: string; name: string; isHost: boolean }>,
  ): void {
    const next = new Map<string, TriviaSeat>();
    for (const p of players) {
      const prev = this.seats.get(p.id);
      next.set(p.id, {
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        score: prev?.score ?? 0,
        chaosCharges: prev?.chaosCharges ?? 0,
        finalWager: prev?.finalWager ?? null,
        finalAnswered: prev?.finalAnswered ?? false,
      });
    }
    this.seats = next;
  }

  setPack(packId: string): boolean {
    if (!isTriviaPackId(packId)) return false;
    this.packId = packId;
    return true;
  }

  setChaosMode(mode: string): boolean {
    if (!isTriviaChaosMode(mode)) return false;
    this.chaosMode = mode;
    return true;
  }

  start(playerIds: string[]): { ok: true; alarmAt: number | null } | { ok: false } {
    if (playerIds.length < 2) return { ok: false };
    this.resetLobbyKeepSeats();
    for (const s of this.seats.values()) {
      s.score = 0;
      s.chaosCharges = 0;
      s.finalWager = null;
      s.finalAnswered = false;
    }
    this.round = "single";
    const pack = getTriviaPack(this.packId);
    this.liveBoard = buildLiveBoard(pack, "single");
    this.controllerId = playerIds[Math.floor(Math.random() * playerIds.length)] ?? playerIds[0]!;
    this.phase = "board";
    this.alarmKind = null;
    return { ok: true, alarmAt: null };
  }

  pickCell(
    playerId: string,
    categoryIndex: number,
    tier: number,
  ): { ok: true; alarmAt: number } | { ok: false; error?: string } {
    if (this.phase !== "board" || !this.liveBoard || this.round == null) return { ok: false };
    if (playerId !== this.controllerId) return { ok: false, error: "Not your pick" };
    if (this.hotSeatPlayerId && playerId === this.hotSeatPlayerId && tier > 0) {
      // Hot seat: must pick lowest remaining tier in some category — soft: prefer tier 0
    }
    const idx = cellIndex(categoryIndex, tier);
    if (idx < 0 || idx >= this.liveBoard.cleared.length) return { ok: false };
    if (this.liveBoard.cleared[idx]) return { ok: false, error: "Already cleared" };
    const clue = this.liveBoard.clues[idx]!;
    const value = this.liveBoard.round === "single"
      ? [200, 400, 600, 800, 1000][tier]!
      : [400, 800, 1200, 1600, 2000][tier]!;
    this.activeCategoryIndex = categoryIndex;
    this.activeTier = tier;
    this.activeValue = value;
    this.activePrompt = clue.prompt;
    this.activeCategoryTitle = this.liveBoard.categories[categoryIndex]!;
    this.isDailyDouble = idx === this.liveBoard.dailyDoubleIndex;
    this.lockedOutIds = [];
    this.buzzedPlayerId = null;
    this.selectedChoiceIndex = null;
    this.shuffledChoices = null;
    this.correctChoiceIndex = null;
    this.clearFx();
    this.cheerScore = 0;
    this.hintExcluded = [];
    this.phoneFriendVotes = {};
    this.trapChoiceIndex = null;
    this.pendingPartyTax = false;
    this.chaosDash = null;
    this.chaosDashWinnerId = null;

    this.phase = "clue";
    this.clueStage = "highlight";
    if (this.isDailyDouble) {
      this.lastOutcome = "dailyDouble";
      const seat = this.seats.get(playerId);
      this.dailyWagerMaxVal = dailyWagerMax(seat?.score ?? 0, value);
    }
    this.endsAt = Date.now() + TRIVIA_CELL_HIGHLIGHT_MS;
    this.alarmKind = "highlightToReveal";
    return { ok: true, alarmAt: this.endsAt };
  }

  private finishHighlight(now: number): void {
    this.clueStage = "reveal";
    if (this.isDailyDouble) {
      this.endsAt = now + TRIVIA_DD_REVEAL_MS;
      this.alarmKind = "ddRevealDone";
      return;
    }
    this.endsAt = now + TRIVIA_CLUE_READ_MS;
    this.alarmKind = "clueToBuzz";
    this.buzzOpenAt = this.endsAt;
  }

  onAlarm(now: number): { alarmAt: number | null } {
    if (this.endsAt != null && this.endsAt > now) {
      return { alarmAt: this.endsAt };
    }
    switch (this.alarmKind) {
      case "highlightToReveal":
        this.finishHighlight(now);
        break;
      case "clueToBuzz":
        this.openBuzz(now);
        break;
      case "ddRevealDone":
        this.phase = "dailyWager";
        this.clueStage = null;
        this.endsAt = null;
        this.alarmKind = null;
        break;
      case "answerTimeout":
        this.timeoutAnswer(now);
        break;
      case "revealDone":
        this.afterReveal(now);
        break;
      case "betweenDone":
        this.beginDouble();
        break;
      case "finalCategoryDone":
        this.beginFinalWager(now);
        break;
      case "finalWagerTimeout":
        this.beginFinalAnswer(now);
        break;
      case "finalAnswerTimeout":
        this.finishFinal();
        break;
      default:
        break;
    }
    return { alarmAt: this.endsAt };
  }

  private openBuzz(now: number): void {
    this.armBuzzJams(now);
    this.clueStage = null;
    this.phase = "buzzOpen";
    this.fakeBuzzPlayerId = null;
    this.spotlightPlayerId = null;
    // Keep buzzOpenAt from finishHighlight so phones that already have it arm together.
    if (this.buzzOpenAt == null) this.buzzOpenAt = now;
    this.endsAt = null;
    this.alarmKind = null;
  }

  setDailyWager(playerId: string, amount: number): { ok: true; alarmAt: number } | { ok: false } {
    if (this.phase !== "dailyWager") return { ok: false };
    if (playerId !== this.controllerId) return { ok: false };
    const max = this.dailyWagerMaxVal ?? this.activeValue ?? TRIVIA_DAILY_WAGER_MIN;
    const wager = Math.max(TRIVIA_DAILY_WAGER_MIN, Math.min(max, Math.floor(amount)));
    this.dailyWager = wager;
    this.beginAnswering(playerId, true);
    return { ok: true, alarmAt: this.endsAt! };
  }

  buzz(playerId: string, now = Date.now()): { ok: true; alarmAt: number } | { ok: false } {
    if (this.phase !== "buzzOpen") return { ok: false };
    if (this.buzzOpenAt != null && now < this.buzzOpenAt) return { ok: false };
    if (this.lockedOutIds.includes(playerId)) return { ok: false };
    const jamUntil = this.buzzJamUntil[playerId] ?? 0;
    if (jamUntil > now) return { ok: false };
    this.buzzedPlayerId = playerId;
    this.buzzLockSeq += 1;
    this.beginAnswering(playerId, false);
    return { ok: true, alarmAt: this.endsAt! };
  }

  private beginAnswering(playerId: string, daily: boolean): void {
    const clueIdx =
      this.activeCategoryIndex != null && this.activeTier != null && this.liveBoard
        ? cellIndex(this.activeCategoryIndex, this.activeTier)
        : -1;
    const clue = clueIdx >= 0 && this.liveBoard ? this.liveBoard.clues[clueIdx]! : null;
    if (clue) {
      const shuffled = shuffleChoices(clue);
      this.shuffledChoices = shuffled.choices;
      this.correctChoiceIndex = shuffled.correctIndex;
    }
    this.buzzedPlayerId = playerId;
    this.buzzOpenAt = null;
    this.phase = "answering";
    this.endsAt = Date.now() + TRIVIA_ANSWER_MS;
    this.alarmKind = "answerTimeout";
    this.fakeBuzzPlayerId = null;
    this.spotlightPlayerId = null;

    if (!daily && this.chaosMode !== "off") {
      this.chaosDash = generateChaosDash();
      this.chaosDashWinnerId = null;
    } else {
      this.chaosDash = null;
    }
  }

  answer(playerId: string, choiceIndex: number): { ok: true; alarmAt: number } | { ok: false } {
    if (this.phase !== "answering") return { ok: false };
    if (playerId !== this.buzzedPlayerId) return { ok: false };
    if (!this.shuffledChoices || choiceIndex < 0 || choiceIndex >= this.shuffledChoices.length) {
      return { ok: false };
    }
    this.selectedChoiceIndex = choiceIndex;
    const correct = choiceIndex === this.correctChoiceIndex;
    this.resolveAnswer(playerId, correct, false);
    return { ok: true, alarmAt: this.endsAt! };
  }

  private timeoutAnswer(_now: number): void {
    if (this.phase !== "answering" || !this.buzzedPlayerId) return;
    this.selectedChoiceIndex = null;
    this.resolveAnswer(this.buzzedPlayerId, false, true);
  }

  private resolveAnswer(playerId: string, correct: boolean, timedOut: boolean): void {
    const seat = this.seats.get(playerId);
    const baseValue = this.isDailyDouble
      ? (this.dailyWager ?? this.activeValue ?? 0)
      : (this.activeValue ?? 0);
    let value = baseValue;
    if (this.swapStakesActive) {
      const leader = [...this.seats.values()].sort((a, b) => b.score - a.score)[0];
      if (leader && leader.id !== playerId) {
        // stake exposure already is cell value; flag just for banner
      }
    }

    if (correct) {
      const cheer = cheerBonusFromMeter(this.cheerScore);
      const result = applyCorrect(seat?.score ?? 0, value, {
        cheerBonus: cheer,
        partyTax: this.pendingPartyTax,
      });
      if (seat) seat.score = result.score;
      this.lastScoreDelta = result.delta;
      if (result.tax > 0) this.pot += result.tax;
      if (this.allianceIds && this.allianceIds.includes(playerId)) {
        const partnerId = this.allianceIds.find((id) => id !== playerId);
        const partner = partnerId ? this.seats.get(partnerId) : undefined;
        if (partner) partner.score += Math.floor(value / 2);
      }
      this.controllerId = playerId;
      this.lastOutcome = "correct";
      this.markCellCleared();
      this.enterReveal(playerId);
    } else {
      const trap =
        this.trapChoiceIndex != null &&
        this.selectedChoiceIndex === this.trapChoiceIndex
          ? 2
          : 1;
      const result = applyWrong(seat?.score ?? 0, value, { trapMultiplier: trap });
      if (seat) seat.score = result.score;
      this.lastScoreDelta = result.delta;
      this.lastOutcome = timedOut ? "timeout" : "wrong";
      if (!this.lockedOutIds.includes(playerId)) this.lockedOutIds.push(playerId);
      this.lastOutcomePlayerId = playerId;
      this.lastOutcomePlayerName = seat?.name ?? null;

      if (this.isDailyDouble || timedOut) {
        this.markCellCleared();
        this.enterReveal(playerId);
        return;
      }

      const eligible = [...this.seats.keys()].filter(
        (id) => !this.lockedOutIds.includes(id),
      );
      if (eligible.length === 0) {
        this.markCellCleared();
        this.enterReveal(playerId);
        return;
      }

      // reopen buzz — short sync grace so all phones arm together
      const reopenNow = Date.now();
      this.clueStage = null;
      this.phase = "buzzOpen";
      this.buzzedPlayerId = null;
      this.buzzOpenAt = reopenNow + TRIVIA_BUZZ_SYNC_MS;
      this.shuffledChoices = null;
      this.correctChoiceIndex = null;
      this.selectedChoiceIndex = null;
      this.chaosDash = null;
      this.endsAt = null;
      this.alarmKind = null;
      this.blindfoldUntil = null;
      return;
    }
  }

  private markCellCleared(): void {
    if (!this.liveBoard || this.activeCategoryIndex == null || this.activeTier == null) return;
    const idx = cellIndex(this.activeCategoryIndex, this.activeTier);
    this.liveBoard.cleared[idx] = true;
  }

  private enterReveal(playerId: string): void {
    this.phase = "reveal";
    this.buzzOpenAt = null;
    this.lastOutcomePlayerId = playerId;
    this.lastOutcomePlayerName = this.seats.get(playerId)?.name ?? null;
    this.challengeOpen = this.chaosMode === "mayhem";
    this.challengeVotes = {};
    this.endsAt = Date.now() + TRIVIA_REVEAL_MS;
    this.alarmKind = "revealDone";
    this.chaosDash = null;
  }

  private afterReveal(_now: number): void {
    if (this.challengeOpen && this.lastScoreDelta && this.lastScoreDelta > 0) {
      const votes = Object.values(this.challengeVotes);
      if (votes.length >= Math.ceil(this.seats.size / 2)) {
        const tooEasy = votes.filter(Boolean).length > votes.length / 2;
        if (tooEasy && this.lastOutcomePlayerId) {
          const seat = this.seats.get(this.lastOutcomePlayerId);
          if (seat) {
            const half = Math.floor(this.lastScoreDelta / 2);
            seat.score -= half;
            this.lastScoreDelta -= half;
          }
        }
      }
    }
    this.challengeOpen = false;

    if (this.lastOutcome === "wrong" || this.lastOutcome === "timeout") {
      if (this.hotSeatPending) {
        this.controllerId = this.lastOutcomePlayerId;
        this.hotSeatPlayerId = this.lastOutcomePlayerId;
      }
    } else {
      this.hotSeatPlayerId = null;
    }
    this.hotSeatPending = false;

    this.clearClue();
    this.clearFx();

    if (!this.liveBoard || remainingCellCount(this.liveBoard) === 0) {
      if (this.round === "single") {
        this.phase = "between";
        this.lastOutcome = "boardClear";
        this.endsAt = Date.now() + TRIVIA_BETWEEN_MS;
        this.alarmKind = "betweenDone";
        return;
      }
      this.beginFinalCategory();
      return;
    }

    this.phase = "board";
    this.endsAt = null;
    this.alarmKind = null;
  }

  private hotSeatPending = false;

  private beginDouble(): void {
    const pack = getTriviaPack(this.packId);
    this.round = "double";
    this.liveBoard = buildLiveBoard(pack, "double");
    this.phase = "board";
    this.endsAt = null;
    this.alarmKind = null;
    this.lastOutcome = null;
  }

  private beginFinalCategory(): void {
    const pack = getTriviaPack(this.packId);
    this.round = null;
    this.liveBoard = null;
    this.finalCategory = pack.final.category;
    this.finalPrompt = null;
    this.finalChoices = null;
    this.finalCorrectIndex = null;
    this.phase = "finalCategory";
    this.endsAt = Date.now() + TRIVIA_FINAL_CATEGORY_MS;
    this.alarmKind = "finalCategoryDone";
  }

  private beginFinalWager(now: number): void {
    this.phase = "finalWager";
    for (const s of this.seats.values()) {
      s.finalWager = null;
      s.finalAnswered = false;
    }
    this.endsAt = now + TRIVIA_FINAL_WAGER_MS;
    this.alarmKind = "finalWagerTimeout";
  }

  setFinalWager(playerId: string, amount: number): { ok: true; alarmAt: number | null } | { ok: false } {
    if (this.phase !== "finalWager") return { ok: false };
    const seat = this.seats.get(playerId);
    if (!seat) return { ok: false };
    const max = Math.max(0, seat.score);
    seat.finalWager = Math.max(0, Math.min(max, Math.floor(amount)));
    if ([...this.seats.values()].every((s) => s.finalWager != null)) {
      this.beginFinalAnswer(Date.now());
      return { ok: true, alarmAt: this.endsAt };
    }
    return { ok: true, alarmAt: this.endsAt };
  }

  private beginFinalAnswer(now: number): void {
    const pack = getTriviaPack(this.packId);
    for (const s of this.seats.values()) {
      if (s.finalWager == null) s.finalWager = 0;
      s.finalAnswered = false;
    }
    const shuffled = shuffleChoices({
      id: "final",
      prompt: pack.final.prompt,
      choices: pack.final.choices,
      correctIndex: pack.final.correctIndex,
    });
    this.finalPrompt = pack.final.prompt;
    this.finalChoices = shuffled.choices;
    this.finalCorrectIndex = shuffled.correctIndex;
    this.phase = "finalAnswer";
    this.endsAt = now + TRIVIA_FINAL_ANSWER_MS;
    this.alarmKind = "finalAnswerTimeout";
  }

  finalAnswer(playerId: string, choiceIndex: number): { ok: true; alarmAt: number | null } | { ok: false } {
    if (this.phase !== "finalAnswer") return { ok: false };
    const seat = this.seats.get(playerId);
    if (!seat || seat.finalAnswered) return { ok: false };
    seat.finalAnswered = true;
    const correct = choiceIndex === this.finalCorrectIndex;
    const wager = seat.finalWager ?? 0;
    const result = applyFinal(seat.score, wager, correct);
    seat.score = result.score;
    if ([...this.seats.values()].every((s) => s.finalAnswered)) {
      this.finishFinal();
      return { ok: true, alarmAt: null };
    }
    return { ok: true, alarmAt: this.endsAt };
  }

  private finishFinal(): void {
    for (const s of this.seats.values()) {
      if (!s.finalAnswered) {
        s.finalAnswered = true;
        const wager = s.finalWager ?? 0;
        const result = applyFinal(s.score, wager, false);
        s.score = result.score;
      }
    }
    this.winners = pickWinners([...this.seats.values()]);
    this.phase = "results";
    this.endsAt = null;
    this.alarmKind = null;
  }

  solveChaos(playerId: string, choiceIndex: number, now = Date.now()): { ok: boolean } {
    if (this.chaosMode === "off") return { ok: false };
    if (this.phase !== "answering") return { ok: false };
    if (!this.chaosDash || this.chaosDashWinnerId) return { ok: false };
    if (playerId === this.buzzedPlayerId) return { ok: false };
    const lock = this.chaosDashLocks.get(playerId) ?? 0;
    if (lock > now) return { ok: false };
    if (choiceIndex !== this.chaosDash.correctIndex) {
      this.chaosDashLocks.set(playerId, now + TRIVIA_CHAOS_DASH_LOCK_MS);
      return { ok: false };
    }
    const seat = this.seats.get(playerId);
    if (!seat) return { ok: false };
    const cap = chaosChargeCap(this.chaosMode);
    if (seat.chaosCharges < cap) {
      seat.chaosCharges += 1;
    }
    this.chaosDashWinnerId = playerId;
    this.chaosWinSeq += 1;
    this.lastOutcome = "chaosWin";
    this.lastOutcomePlayerId = playerId;
    this.lastOutcomePlayerName = seat.name;
    return { ok: true };
  }

  useChaos(
    playerId: string,
    power: string,
    targetPlayerId?: string,
    now = Date.now(),
  ): { ok: boolean; error?: string } {
    if (!isTriviaChaosPower(power)) return { ok: false };
    if (!powersForMode(this.chaosMode).includes(power)) return { ok: false };
    const seat = this.seats.get(playerId);
    if (!seat || seat.chaosCharges < 1) return { ok: false };

    const spend = () => {
      seat.chaosCharges -= 1;
      this.lastOutcome = power;
      this.lastOutcomePlayerId = playerId;
      this.lastOutcomePlayerName = seat.name;
    };

    switch (power) {
      case "fakeBuzz": {
        if (this.phase !== "buzzOpen") return { ok: false, error: "Not during buzz" };
        const target =
          targetPlayerId && this.seats.has(targetPlayerId)
            ? targetPlayerId
            : [...this.seats.keys()].filter((id) => id !== playerId)[
                Math.floor(Math.random() * Math.max(1, this.seats.size - 1))
              ];
        this.fakeBuzzPlayerId = target ?? null;
        spend();
        return { ok: true };
      }
      case "spotlightSteal": {
        if (this.phase !== "buzzOpen") return { ok: false };
        const target =
          targetPlayerId && this.seats.has(targetPlayerId)
            ? targetPlayerId
            : [...this.seats.keys()][Math.floor(Math.random() * this.seats.size)]!;
        this.spotlightPlayerId = target;
        spend();
        return { ok: true };
      }
      case "buzzJam": {
        if (this.phase !== "board" && this.phase !== "clue" && this.phase !== "buzzOpen") {
          return { ok: false };
        }
        const target = targetPlayerId && this.seats.has(targetPlayerId) ? targetPlayerId : null;
        if (!target || target === playerId) return { ok: false, error: "Pick a rival" };
        this.buzzJamUntil[target] = (this.phase === "buzzOpen" ? now : now) + TRIVIA_BUZZ_JAM_MS;
        if (this.phase === "buzzOpen") {
          this.buzzJamUntil[target] = now + TRIVIA_BUZZ_JAM_MS;
        } else {
          // arm: apply 1s jam when buzz opens — store as far-future marker then apply in openBuzz
          this.buzzJamUntil[target] = Number.MAX_SAFE_INTEGER; // armed
        }
        spend();
        return { ok: true };
      }
      case "blindfold": {
        if (this.phase !== "answering") return { ok: false };
        this.blindfoldUntil = now + TRIVIA_BLINDFOLD_MS;
        spend();
        return { ok: true };
      }
      case "screenZap": {
        if (this.phase !== "answering") return { ok: false };
        this.screenZapUntil = now + TRIVIA_SCREEN_ZAP_MS;
        spend();
        return { ok: true };
      }
      case "cheerBoo": {
        if (this.phase !== "answering") return { ok: false };
        // enables cheer; spending activates boosted meter start
        this.cheerScore += 0;
        spend();
        return { ok: true };
      }
      case "partyTax": {
        if (this.phase !== "answering" && this.phase !== "reveal") return { ok: false };
        this.pendingPartyTax = true;
        spend();
        return { ok: true };
      }
      case "trapAnswer": {
        if (this.phase !== "answering" || !this.shuffledChoices) return { ok: false };
        const wrong = this.shuffledChoices
          .map((_, i) => i)
          .filter((i) => i !== this.correctChoiceIndex);
        this.trapChoiceIndex = wrong[Math.floor(Math.random() * wrong.length)] ?? null;
        spend();
        return { ok: true };
      }
      case "stealBuzz": {
        if (this.phase !== "answering" || !this.buzzedPlayerId) return { ok: false };
        if (playerId === this.buzzedPlayerId) return { ok: false };
        this.buzzedPlayerId = playerId;
        this.buzzLockSeq += 1;
        this.chaosDash = null;
        spend();
        return { ok: true };
      }
      case "potSiphon": {
        if (this.pot <= 0) return { ok: false };
        seat.score += this.pot;
        this.pot = 0;
        spend();
        return { ok: true };
      }
      case "swapStakes": {
        this.swapStakesActive = true;
        spend();
        return { ok: true };
      }
      case "challenge": {
        if (this.phase !== "reveal") return { ok: false };
        this.challengeOpen = true;
        spend();
        return { ok: true };
      }
      case "hotSeat": {
        if (this.phase !== "reveal") return { ok: false };
        if (this.lastOutcome !== "wrong" && this.lastOutcome !== "timeout") return { ok: false };
        this.hotSeatPending = true;
        spend();
        return { ok: true };
      }
      case "alliance": {
        const target = targetPlayerId && this.seats.has(targetPlayerId) ? targetPlayerId : null;
        if (!target || target === playerId) return { ok: false };
        this.allianceIds = [playerId, target];
        spend();
        return { ok: true };
      }
      case "hintTax": {
        if (this.phase !== "answering" || !this.shuffledChoices) return { ok: false };
        if (seat.score < TRIVIA_HINT_TAX) return { ok: false, error: "Need more points" };
        seat.score -= TRIVIA_HINT_TAX;
        this.pot += TRIVIA_HINT_TAX;
        const wrong = this.shuffledChoices
          .map((_, i) => i)
          .filter((i) => i !== this.correctChoiceIndex && !this.hintExcluded.includes(i));
        shuffleArray(wrong);
        this.hintExcluded = [...this.hintExcluded, ...wrong.slice(0, 3)];
        spend();
        return { ok: true };
      }
      case "phoneFriend": {
        if (this.phase !== "answering" || playerId !== this.buzzedPlayerId) return { ok: false };
        this.phoneFriendVotes = {};
        spend();
        return { ok: true };
      }
      default:
        return { ok: false };
    }
  }

  cheer(playerId: string, delta: 1 | -1): void {
    if (this.phase !== "answering") return;
    if (playerId === this.buzzedPlayerId) return;
    this.cheerScore += delta;
  }

  phoneFriendVote(playerId: string, choiceIndex: number): void {
    if (this.phase !== "answering") return;
    if (playerId === this.buzzedPlayerId) return;
    this.phoneFriendVotes[playerId] = choiceIndex;
  }

  challengeVote(playerId: string, tooEasy: boolean): void {
    if (!this.challengeOpen) return;
    this.challengeVotes[playerId] = tooEasy;
  }

  /** Apply armed buzz jams when buzz opens. */
  armBuzzJams(now: number): void {
    for (const [id, until] of Object.entries(this.buzzJamUntil)) {
      if (until === Number.MAX_SAFE_INTEGER) {
        this.buzzJamUntil[id] = now + TRIVIA_BUZZ_JAM_MS;
      }
    }
  }

  snapshot(code: string): TriviaRoomState {
    const now = Date.now();
    // clear expired fake glow
    if (this.fakeBuzzPlayerId && this.phase !== "buzzOpen") this.fakeBuzzPlayerId = null;

    return {
      game: "trivia",
      code,
      phase: this.phase,
      packId: this.packId,
      chaosMode: this.chaosMode,
      round: this.round,
      board: this.liveBoard ? toPublicBoard(this.liveBoard) : null,
      controllerId: this.controllerId,
      clueStage: this.clueStage,
      activeClue:
        this.activeCategoryIndex != null && this.activeTier != null
          ? {
              categoryIndex: this.activeCategoryIndex,
              tier: this.activeTier,
              value: this.activeValue ?? 0,
              categoryTitle: this.activeCategoryTitle ?? "",
              prompt:
                this.clueStage === "highlight" || this.activePrompt == null
                  ? ""
                  : this.activePrompt,
              isDailyDouble: this.isDailyDouble,
              choices:
                this.phase === "answering" || this.phase === "reveal"
                  ? this.shuffledChoices
                  : null,
              correctChoiceIndex: this.phase === "reveal" ? this.correctChoiceIndex : null,
              selectedChoiceIndex: this.selectedChoiceIndex,
            }
          : null,
      buzzedPlayerId: this.buzzedPlayerId,
      buzzLockSeq: this.buzzLockSeq,
      buzzOpenAt: this.buzzOpenAt,
      lockedOutIds: [...this.lockedOutIds],
      players: [...this.seats.values()].map((s) => ({
        id: s.id,
        name: s.name,
        isHost: s.isHost,
        score: s.score,
        chaosCharges: s.chaosCharges,
        finalWager: s.finalWager,
        finalAnswered: s.finalAnswered,
      })),
      endsAt: this.endsAt,
      dailyWager: this.dailyWager,
      dailyWagerMax: this.dailyWagerMaxVal,
      finalCategory: this.finalCategory,
      finalPrompt: this.finalPrompt,
      finalChoices: this.finalChoices,
      finalCorrectIndex:
        this.phase === "results" ? this.finalCorrectIndex : null,
      pot: this.pot,
      chaosDash:
        this.chaosDash && this.phase === "answering"
          ? {
              kind: this.chaosDash.kind,
              prompt: this.chaosDash.prompt,
              choices: this.chaosDash.choices,
              winnerId: this.chaosDashWinnerId,
              winnerName: this.chaosDashWinnerId
                ? this.seats.get(this.chaosDashWinnerId)?.name ?? null
                : null,
            }
          : null,
      chaosWinSeq: this.chaosWinSeq,
      lastOutcome: this.lastOutcome,
      lastOutcomePlayerId: this.lastOutcomePlayerId,
      lastOutcomePlayerName: this.lastOutcomePlayerName,
      blindfoldUntil: this.blindfoldUntil && this.blindfoldUntil > now ? this.blindfoldUntil : null,
      screenZapUntil: this.screenZapUntil && this.screenZapUntil > now ? this.screenZapUntil : null,
      fakeBuzzPlayerId: this.fakeBuzzPlayerId,
      spotlightPlayerId: this.spotlightPlayerId,
      buzzJamUntil: { ...this.buzzJamUntil },
      cheerScore: this.cheerScore,
      hintExcluded: [...this.hintExcluded],
      phoneFriendVotes: { ...this.phoneFriendVotes },
      trapChoiceIndex: this.trapChoiceIndex,
      allianceIds: this.allianceIds ? [...this.allianceIds] : null,
      hotSeatPlayerId: this.hotSeatPlayerId,
      challengeOpen: this.challengeOpen,
      challengeVotes: { ...this.challengeVotes },
      lastScoreDelta: this.lastScoreDelta,
      results:
        this.phase === "results"
          ? [...this.seats.values()].map((s) => ({
              id: s.id,
              name: s.name,
              score: s.score,
            }))
          : [],
      winners: this.phase === "results" ? [...this.winners] : [],
    };
  }

  toPersisted(): TriviaPersisted {
    return {
      packId: this.packId,
      chaosMode: this.chaosMode,
      phase: this.phase,
      round: this.round,
      liveBoard: this.liveBoard,
      controllerId: this.controllerId,
      activeCategoryIndex: this.activeCategoryIndex,
      activeTier: this.activeTier,
      activeValue: this.activeValue,
      activePrompt: this.activePrompt,
      activeCategoryTitle: this.activeCategoryTitle,
      clueStage: this.clueStage,
      isDailyDouble: this.isDailyDouble,
      shuffledChoices: this.shuffledChoices,
      correctChoiceIndex: this.correctChoiceIndex,
      selectedChoiceIndex: this.selectedChoiceIndex,
      buzzedPlayerId: this.buzzedPlayerId,
      buzzLockSeq: this.buzzLockSeq,
      buzzOpenAt: this.buzzOpenAt,
      lockedOutIds: this.lockedOutIds,
      endsAt: this.endsAt,
      dailyWager: this.dailyWager,
      dailyWagerMax: this.dailyWagerMaxVal,
      finalCategory: this.finalCategory,
      finalPrompt: this.finalPrompt,
      finalChoices: this.finalChoices,
      finalCorrectIndex: this.finalCorrectIndex,
      pot: this.pot,
      chaosDash: this.chaosDash,
      chaosDashWinnerId: this.chaosDashWinnerId,
      chaosWinSeq: this.chaosWinSeq,
      lastOutcome: this.lastOutcome,
      lastOutcomePlayerId: this.lastOutcomePlayerId,
      lastOutcomePlayerName: this.lastOutcomePlayerName,
      blindfoldUntil: this.blindfoldUntil,
      screenZapUntil: this.screenZapUntil,
      fakeBuzzPlayerId: this.fakeBuzzPlayerId,
      spotlightPlayerId: this.spotlightPlayerId,
      buzzJamUntil: this.buzzJamUntil,
      cheerScore: this.cheerScore,
      hintExcluded: this.hintExcluded,
      phoneFriendVotes: this.phoneFriendVotes,
      trapChoiceIndex: this.trapChoiceIndex,
      allianceIds: this.allianceIds,
      hotSeatPlayerId: this.hotSeatPlayerId,
      challengeOpen: this.challengeOpen,
      challengeVotes: this.challengeVotes,
      lastScoreDelta: this.lastScoreDelta,
      pendingPartyTax: this.pendingPartyTax,
      swapStakesActive: this.swapStakesActive,
      winners: this.winners,
      seats: [...this.seats.values()],
      alarmKind: this.alarmKind,
    };
  }

  loadPersisted(data: TriviaPersisted | null | undefined): void {
    if (!data) return;
    this.packId = normalizeTriviaPackId(data.packId);
    this.chaosMode = isTriviaChaosMode(data.chaosMode) ? data.chaosMode : DEFAULT_TRIVIA_CHAOS_MODE;
    this.phase = data.phase ?? "lobby";
    this.round = data.round ?? null;
    this.liveBoard = data.liveBoard ?? null;
    this.controllerId = data.controllerId ?? null;
    this.activeCategoryIndex = data.activeCategoryIndex ?? null;
    this.activeTier = data.activeTier ?? null;
    this.activeValue = data.activeValue ?? null;
    this.activePrompt = data.activePrompt ?? null;
    this.activeCategoryTitle = data.activeCategoryTitle ?? null;
    this.clueStage = data.clueStage ?? null;
    this.isDailyDouble = Boolean(data.isDailyDouble);
    this.shuffledChoices = data.shuffledChoices ?? null;
    this.correctChoiceIndex = data.correctChoiceIndex ?? null;
    this.selectedChoiceIndex = data.selectedChoiceIndex ?? null;
    this.buzzedPlayerId = data.buzzedPlayerId ?? null;
    this.buzzLockSeq = data.buzzLockSeq ?? 0;
    this.buzzOpenAt = data.buzzOpenAt ?? null;
    this.lockedOutIds = data.lockedOutIds ?? [];
    this.endsAt = data.endsAt ?? null;
    this.dailyWager = data.dailyWager ?? null;
    this.dailyWagerMaxVal = data.dailyWagerMax ?? null;
    this.finalCategory = data.finalCategory ?? null;
    this.finalPrompt = data.finalPrompt ?? null;
    this.finalChoices = data.finalChoices ?? null;
    this.finalCorrectIndex = data.finalCorrectIndex ?? null;
    this.pot = data.pot ?? 0;
    this.chaosDash = data.chaosDash ?? null;
    this.chaosDashWinnerId = data.chaosDashWinnerId ?? null;
    this.chaosWinSeq = data.chaosWinSeq ?? 0;
    this.lastOutcome = data.lastOutcome ?? null;
    this.lastOutcomePlayerId = data.lastOutcomePlayerId ?? null;
    this.lastOutcomePlayerName = data.lastOutcomePlayerName ?? null;
    this.blindfoldUntil = data.blindfoldUntil ?? null;
    this.screenZapUntil = data.screenZapUntil ?? null;
    this.fakeBuzzPlayerId = data.fakeBuzzPlayerId ?? null;
    this.spotlightPlayerId = data.spotlightPlayerId ?? null;
    this.buzzJamUntil = data.buzzJamUntil ?? {};
    this.cheerScore = data.cheerScore ?? 0;
    this.hintExcluded = data.hintExcluded ?? [];
    this.phoneFriendVotes = data.phoneFriendVotes ?? {};
    this.trapChoiceIndex = data.trapChoiceIndex ?? null;
    this.allianceIds = data.allianceIds ?? null;
    this.hotSeatPlayerId = data.hotSeatPlayerId ?? null;
    this.challengeOpen = Boolean(data.challengeOpen);
    this.challengeVotes = data.challengeVotes ?? {};
    this.lastScoreDelta = data.lastScoreDelta ?? null;
    this.pendingPartyTax = Boolean(data.pendingPartyTax);
    this.swapStakesActive = Boolean(data.swapStakesActive);
    this.winners = data.winners ?? [];
    this.seats = new Map((data.seats ?? []).map((s) => [s.id, { ...s }]));
    this.alarmKind = data.alarmKind ?? null;
  }
}

function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = t;
  }
}
