from dataclasses import dataclass
from difflib import SequenceMatcher
import re

from app.models.compliance import ScreeningStatus


RESTRICTED_TERMS = {
    "sanction": ("Global Sanctions", 0.94),
    "blocked": ("Denied Parties", 0.91),
    "restricted": ("Restricted Entity List", 0.86),
    "missile": ("Dual-use Controls", 0.82),
}

WATCHLIST_ENTITIES = {
    "Acme Restricted Trading": ("Denied Parties", 0.92),
    "North Arms Holdings": ("Denied Parties", 0.91),
    "Global Export Services": ("Global Sanctions", 0.88),
    "Red Falcon Logistics": ("Restricted Entity List", 0.83),
}

EMBARGOED_COUNTRIES = {"CU", "IR", "KP", "SY", "RU", "BY"}


def normalize_text(text: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", "", text.lower()).strip()


def fuzzy_similarity(source: str, target: str) -> float:
    return SequenceMatcher(None, normalize_text(source), normalize_text(target)).ratio()


@dataclass(frozen=True)
class ScreeningDecision:
    status: ScreeningStatus
    risk_score: float
    rationale: str
    hits: list[dict[str, str | float]]


def screen_subject(subject_name: str, country: str | None) -> ScreeningDecision:
    normalized = subject_name.lower()
    hits: list[dict[str, str | float]] = []
    score = 0.08

    for term, (source, term_score) in RESTRICTED_TERMS.items():
        if term in normalized:
            score = max(score, term_score)
            hits.append(
                {
                    "source": source,
                    "matched_name": subject_name,
                    "score": term_score,
                    "notes": f"Subject name includes high-risk term '{term}'.",
                }
            )

    for target, (source, target_score) in WATCHLIST_ENTITIES.items():
        similarity = fuzzy_similarity(subject_name, target)
        if similarity >= 0.75:
            score = max(score, similarity)
            hits.append(
                {
                    "source": source,
                    "matched_name": target,
                    "score": round(similarity, 2),
                    "notes": f"Fuzzy watchlist match against '{target}' ({round(similarity * 100)}% similarity).",
                }
            )

    if country and country.upper() in EMBARGOED_COUNTRIES:
        score = max(score, 0.88)
        hits.append(
            {
                "source": "Country Controls",
                "matched_name": country.upper(),
                "score": 0.88,
                "notes": "Destination or counterparty country requires enhanced export review.",
            }
        )

    if score >= 0.9:
        status = ScreeningStatus.blocked
        rationale = "Potential denied-party or sanctions concern detected."
    elif score >= 0.75:
        status = ScreeningStatus.review
        rationale = "Enhanced review required before export release."
    else:
        status = ScreeningStatus.clear
        rationale = "No immediate export compliance concern detected by baseline rules."

    return ScreeningDecision(status=status, risk_score=round(score, 2), rationale=rationale, hits=hits)
