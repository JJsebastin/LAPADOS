from django.core.management.base import BaseCommand
from apps.moduloz.models import Module, Quiz
from django.utils.text import slugify

MODULES = [
    {
        "title": "What is Doping?",
        "icon": "BAN",
        "order": 1,
        "duration_mins": 8,
        "description": "Understand what doping means, its history, and why it's banned in sports.",
        "content": """
<h2>Definition of Doping</h2>
<p>Doping in sports refers to the use of <strong>prohibited substances or methods</strong> to gain an unfair competitive advantage. The term covers a wide range of practices from taking banned drugs to using blood transfusions or gene manipulation.</p>

<h2>Why is Doping Banned?</h2>
<ul>
  <li>It violates the spirit of fair play and sportsmanship</li>
  <li>Many doping substances pose <strong>serious health risks</strong>, including heart failure, liver damage, and hormonal imbalances</li>
  <li>It sets a dangerous example for younger athletes</li>
  <li>It undermines public trust in sports</li>
</ul>

<h2>The World Anti-Doping Agency (WADA)</h2>
<p>WADA was established in 1999 to coordinate and monitor the fight against doping in sport. It publishes the <strong>Prohibited List</strong> annually — a comprehensive list of substances and methods that are banned in competition, out of competition, or in specific sports.</p>

<h2>The Three Criteria for Prohibition</h2>
<p>A substance or method is added to the Prohibited List if it meets <em>two of the following three</em> criteria:</p>
<ol>
  <li>It has the potential to enhance sport performance</li>
  <li>It represents a real or potential health risk to the athlete</li>
  <li>It violates the spirit of sport</li>
</ol>

<blockquote style="border-left:4px solid #E63946;padding-left:1rem;margin:1rem 0;color:#9ca3af">
"Athletes are responsible for any substance found in their bodies — whether taken knowingly or not."
— WADA World Anti-Doping Code
</blockquote>
""",
        "quizzes": [
            {
                "question": "When was the World Anti-Doping Agency (WADA) established?",
                "option_a": "1984",
                "option_b": "1999",
                "option_c": "2004",
                "option_d": "1972",
                "correct": "B",
                "explanation": "WADA was founded in 1999 in response to the Tour de France doping scandal of 1998."
            },
            {
                "question": "How many of WADA's three criteria must a substance meet to be added to the Prohibited List?",
                "option_a": "All three",
                "option_b": "At least one",
                "option_c": "At least two",
                "option_d": "Exactly three",
                "correct": "C",
                "explanation": "A substance needs to satisfy at least TWO of the three criteria to be prohibited."
            },
            {
                "question": "Which of the following is NOT a reason for banning doping?",
                "option_a": "Health risks to athletes",
                "option_b": "Violation of fair play",
                "option_c": "It makes sports more entertaining",
                "option_d": "Negative example for young athletes",
                "correct": "C",
                "explanation": "Doping is banned for health, fairness, and ethical reasons — not because it affects entertainment."
            },
        ]
    },
    {
        "title": "The WADA Prohibited List",
        "icon": "LIST",
        "order": 2,
        "duration_mins": 12,
        "description": "Explore the categories of banned substances and methods athletes must avoid.",
        "content": """
<h2>Understanding the Prohibited List</h2>
<p>The WADA Prohibited List is updated every year on <strong>January 1st</strong>. It categorizes prohibited substances and methods into three sections:</p>

<h2>Section S — Prohibited Substances</h2>
<ul>
  <li><strong>S0 — Non-approved substances:</strong> Any pharmacological substance not approved for human therapeutic use</li>
  <li><strong>S1 — Anabolic Agents:</strong> Anabolic steroids (e.g., testosterone, stanozolol), SARMs</li>
  <li><strong>S2 — Peptide Hormones:</strong> EPO, HGH, IGF-1, insulin</li>
  <li><strong>S3 — Beta-2 Agonists:</strong> High doses of salbutamol, formoterol (asthma medications)</li>
  <li><strong>S4 — Hormone Modulators:</strong> Aromatase inhibitors, SERMs, anti-estrogens</li>
  <li><strong>S5 — Diuretics & Masking Agents:</strong> Substances that alter urine composition</li>
  <li><strong>S6 — Stimulants:</strong> Amphetamine, cocaine, ephedrine (in competition only)</li>
  <li><strong>S7 — Narcotics:</strong> Morphine, oxycodone (in competition only)</li>
  <li><strong>S8 — Cannabinoids:</strong> Cannabis, synthetic cannabinoids (in competition only)</li>
  <li><strong>S9 — Glucocorticoids:</strong> All routes except topical skin, eye, ear (in competition only)</li>
</ul>

<h2>Section M — Prohibited Methods</h2>
<ul>
  <li><strong>M1 — Blood Manipulation:</strong> Blood transfusions, artificial oxygen carriers</li>
  <li><strong>M2 — Chemical & Physical Manipulation:</strong> Urine substitution, IV infusions &gt;100 mL</li>
  <li><strong>M3 — Gene Doping:</strong> Gene editing to enhance performance</li>
</ul>

<h2>Section P — Prohibited in Specific Sports</h2>
<p>Beta-blockers are prohibited in archery, golf, and shooting where a steadier hand provides competitive advantage.</p>

<div style="background:#1f2937;border-radius:0.75rem;padding:1rem;margin-top:1rem">
  <strong style="color:#E63946">💡 Important:</strong> Some substances are only banned IN-COMPETITION, while others are banned year-round (out-of-competition too).
</div>
""",
        "quizzes": [
            {
                "question": "When is the WADA Prohibited List updated?",
                "option_a": "Every 5 years",
                "option_b": "Every January 1st",
                "option_c": "Every Olympic year",
                "option_d": "Whenever needed",
                "correct": "B",
                "explanation": "The Prohibited List is reviewed and updated annually, effective January 1st each year."
            },
            {
                "question": "EPO (Erythropoietin) falls under which WADA category?",
                "option_a": "S1 — Anabolic Agents",
                "option_b": "S3 — Beta-2 Agonists",
                "option_c": "S2 — Peptide Hormones",
                "option_d": "M1 — Blood Manipulation",
                "correct": "C",
                "explanation": "EPO is a peptide hormone classified under S2 on the WADA Prohibited List."
            },
            {
                "question": "Which substance is ONLY prohibited in specific sports like archery and shooting?",
                "option_a": "Anabolic steroids",
                "option_b": "Beta-blockers",
                "option_c": "Cannabis",
                "option_d": "HGH",
                "correct": "B",
                "explanation": "Beta-blockers reduce tremors and heart rate, giving an unfair advantage in precision sports."
            },
            {
                "question": "Gene doping falls under which WADA category?",
                "option_a": "S5",
                "option_b": "M2",
                "option_c": "M3",
                "option_d": "S9",
                "correct": "C",
                "explanation": "Gene doping (M3) involves gene editing or transfer to enhance performance and is strictly prohibited."
            },
        ]
    },
    {
        "title": "Therapeutic Use Exemptions (TUE)",
        "icon": "TUE",
        "order": 3,
        "duration_mins": 10,
        "description": "Learn how athletes with medical conditions can use prohibited substances legally.",
        "content": """
<h2>What is a TUE?</h2>
<p>A <strong>Therapeutic Use Exemption (TUE)</strong> allows an athlete to use a prohibited substance or method for legitimate medical treatment without facing sanctions. Athletes must apply for a TUE before using the substance if possible.</p>

<h2>The Four TUE Criteria</h2>
<p>To be granted a TUE, ALL four conditions must be met:</p>
<ol>
  <li>The athlete would suffer significant health damage if the prohibited substance was not used</li>
  <li>The therapeutic use would not enhance performance beyond restoring the athlete's normal health</li>
  <li>There is no reasonable alternative to the prohibited substance</li>
  <li>The necessity is not a consequence of prior doping</li>
</ol>

<h2>How to Apply for a TUE</h2>
<ul>
  <li>Apply through your <strong>National Anti-Doping Organization (NADO)</strong> or International Federation (IF)</li>
  <li>Applications must be submitted ideally <strong>30 days before competition</strong></li>
  <li>Emergency TUEs can be granted retroactively in urgent situations</li>
  <li>A TUE Committee (TUEC) of at least 3 independent physicians reviews each application</li>
</ul>

<h2>Common Examples of TUE Usage</h2>
<table style="width:100%;border-collapse:collapse;margin-top:1rem">
  <thead>
    <tr style="border-bottom:1px solid #374151">
      <th style="text-align:left;padding:0.5rem;color:#9ca3af">Condition</th>
      <th style="text-align:left;padding:0.5rem;color:#9ca3af">Substance</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #1f2937">
      <td style="padding:0.5rem">Asthma</td>
      <td style="padding:0.5rem">High-dose salbutamol or formoterol</td>
    </tr>
    <tr style="border-bottom:1px solid #1f2937">
      <td style="padding:0.5rem">ADHD</td>
      <td style="padding:0.5rem">Methylphenidate (Ritalin), amphetamines</td>
    </tr>
    <tr style="border-bottom:1px solid #1f2937">
      <td style="padding:0.5rem">Hypogonadism</td>
      <td style="padding:0.5rem">Testosterone</td>
    </tr>
    <tr>
      <td style="padding:0.5rem">Inflammatory conditions</td>
      <td style="padding:0.5rem">Corticosteroids</td>
    </tr>
  </tbody>
</table>
""",
        "quizzes": [
            {
                "question": "How many criteria must be met for a TUE to be granted?",
                "option_a": "1",
                "option_b": "2",
                "option_c": "3",
                "option_d": "All 4",
                "correct": "D",
                "explanation": "All four TUE criteria must be satisfied simultaneously for a TUE to be approved."
            },
            {
                "question": "How far in advance should a TUE ideally be submitted before competition?",
                "option_a": "7 days",
                "option_b": "30 days",
                "option_c": "6 months",
                "option_d": "1 year",
                "correct": "B",
                "explanation": "Athletes should submit TUE applications at least 30 days before competition to allow processing time."
            },
            {
                "question": "Can a TUE be granted retroactively?",
                "option_a": "Never",
                "option_b": "Yes, for emergencies only",
                "option_c": "Only if the athlete is a professional",
                "option_d": "Yes, always",
                "correct": "B",
                "explanation": "Retroactive TUEs are only granted in emergency situations where the athlete could not apply in advance."
            },
        ]
    },
    {
        "title": "Testing & The Athlete Biological Passport",
        "icon": "LAB",
        "order": 4,
        "duration_mins": 15,
        "description": "Discover how anti-doping testing works and how the ABP tracks athletes over time.",
        "content": """
<h2>How Anti-Doping Testing Works</h2>
<p>Athletes can be tested at any time — <strong>in-competition</strong> and <strong>out-of-competition</strong>. Anti-Doping Organizations (ADOs) select athletes for testing using both targeted (risk-based) and random selection methods.</p>

<h2>Types of Samples</h2>
<ul>
  <li><strong>Urine (most common):</strong> Detects most prohibited substances</li>
  <li><strong>Blood:</strong> Used for peptide hormones, blood transfusions, and the ABP</li>
  <li><strong>Dried Blood Spot (DBS):</strong> Newer method, less invasive</li>
  <li><strong>Hair/Saliva:</strong> Used in some research contexts</li>
</ul>

<h2>The Whereabouts System</h2>
<p>Elite athletes in the Registered Testing Pool (RTP) must provide their <strong>whereabouts information</strong> so they can be located for no-notice testing. This includes:</p>
<ul>
  <li>A daily one-hour time slot where they will be available for testing</li>
  <li>Regular training, competition, and accommodation locations</li>
  <li>Three missed tests or whereabouts failures within 12 months = anti-doping rule violation</li>
</ul>

<h2>The Athlete Biological Passport (ABP)</h2>
<p>The ABP is a digital record of an athlete's biological markers over time. Instead of testing for specific substances, it monitors the <em>effects</em> of doping on the body. Any statistically abnormal variation triggers further investigation.</p>

<h3>ABP Modules</h3>
<ul>
  <li><strong>Haematological Module:</strong> Tracks red blood cell parameters to detect blood doping and EPO use</li>
  <li><strong>Steroidal Module:</strong> Monitors steroid levels and endogenous steroid profiles</li>
  <li><strong>Endocrine Module:</strong> Under development — tracks growth hormone markers</li>
</ul>

<div style="background:#1f2937;border-radius:0.75rem;padding:1rem;margin-top:1rem">
  <strong style="color:#E63946">📊 Key Stat:</strong> The ABP has led to numerous suspensions and is used as standalone evidence without requiring direct detection of a substance.
</div>
""",
        "quizzes": [
            {
                "question": "What does ABP stand for?",
                "option_a": "Anti-Banned Products",
                "option_b": "Athlete Biological Passport",
                "option_c": "Athlete Blood Panel",
                "option_d": "Annual Biological Profile",
                "correct": "B",
                "explanation": "The Athlete Biological Passport monitors biological markers over time to detect the effects of doping."
            },
            {
                "question": "How many whereabouts failures within 12 months constitute an anti-doping rule violation?",
                "option_a": "1",
                "option_b": "2",
                "option_c": "3",
                "option_d": "5",
                "correct": "C",
                "explanation": "Three whereabouts failures (missed tests or filing failures) within 12 months is an ADRV."
            },
            {
                "question": "Which ABP module is designed to detect blood doping and EPO use?",
                "option_a": "Steroidal Module",
                "option_b": "Haematological Module",
                "option_c": "Endocrine Module",
                "option_d": "Metabolic Module",
                "correct": "B",
                "explanation": "The Haematological Module tracks red blood cell parameters to identify abnormal patterns from blood doping."
            },
            {
                "question": "Which sample type is used most commonly in anti-doping tests?",
                "option_a": "Blood",
                "option_b": "Hair",
                "option_c": "Urine",
                "option_d": "Saliva",
                "correct": "C",
                "explanation": "Urine is the most common sample type as it can detect a wide range of prohibited substances."
            },
        ]
    },
    {
        "title": "Consequences of Doping",
        "icon": "LAW",
        "order": 5,
        "duration_mins": 8,
        "description": "Understand the sanctions, health risks, and career impact of doping violations.",
        "content": """
<h2>Anti-Doping Rule Violations (ADRVs)</h2>
<p>The World Anti-Doping Code defines 11 anti-doping rule violations (ADRVs). The most common are:</p>
<ul>
  <li>Presence of a prohibited substance in a sample</li>
  <li>Use of a prohibited substance or method</li>
  <li>Refusing to provide a sample</li>
  <li>Tampering with sample collection</li>
  <li>Whereabouts failures (3 within 12 months)</li>
  <li>Trafficking or administration of prohibited substances</li>
</ul>

<h2>Standard Sanctions</h2>
<table style="width:100%;border-collapse:collapse;margin-top:1rem">
  <thead>
    <tr style="border-bottom:1px solid #374151">
      <th style="text-align:left;padding:0.5rem;color:#9ca3af">Violation Type</th>
      <th style="text-align:left;padding:0.5rem;color:#9ca3af">Sanction</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom:1px solid #1f2937">
      <td style="padding:0.5rem">First offense (non-specified substance)</td>
      <td style="padding:0.5rem"><strong style="color:#E63946">4 years</strong> ban</td>
    </tr>
    <tr style="border-bottom:1px solid #1f2937">
      <td style="padding:0.5rem">First offense (specified/contaminated)</td>
      <td style="padding:0.5rem"><strong>1–2 years</strong> ban</td>
    </tr>
    <tr style="border-bottom:1px solid #1f2937">
      <td style="padding:0.5rem">Second offense</td>
      <td style="padding:0.5rem"><strong style="color:#E63946">Lifetime ban</strong></td>
    </tr>
    <tr>
      <td style="padding:0.5rem">Trafficking/administration</td>
      <td style="padding:0.5rem"><strong style="color:#E63946">4 years to lifetime</strong></td>
    </tr>
  </tbody>
</table>

<h2>Health Consequences</h2>
<ul>
  <li><strong>Anabolic steroids:</strong> Liver damage, cardiovascular disease, hormonal disruption, psychiatric effects ("roid rage")</li>
  <li><strong>EPO:</strong> Blood thickening, stroke, heart attack risk (especially at night when heart rate drops)</li>
  <li><strong>HGH:</strong> Acromegaly, joint pain, diabetes risk</li>
  <li><strong>Stimulants:</strong> Heart arrhythmia, heat stroke, addiction</li>
  <li><strong>Blood transfusions:</strong> Infections (HIV, hepatitis), immune reactions</li>
</ul>

<h2>Beyond Sports</h2>
<p>A doping violation doesn't just end careers — it can result in:</p>
<ul>
  <li>Loss of medals, titles, and prize money</li>
  <li>Repayment of funding and sponsorships</li>
  <li>Criminal charges in some countries</li>
  <li>Permanent reputational damage</li>
</ul>

<blockquote style="border-left:4px solid #E63946;padding-left:1rem;margin:1rem 0;color:#9ca3af">
"No medal is worth your health, your integrity, or your career." — Anti-Doping Advocate
</blockquote>
""",
        "quizzes": [
            {
                "question": "What is the standard ban for a first anti-doping offense involving a non-specified substance?",
                "option_a": "1 year",
                "option_b": "2 years",
                "option_c": "4 years",
                "option_d": "Lifetime",
                "correct": "C",
                "explanation": "The standard period of ineligibility for a first offense involving a non-specified substance is 4 years."
            },
            {
                "question": "Which doping substance increases the risk of stroke due to blood thickening?",
                "option_a": "Anabolic steroids",
                "option_b": "EPO",
                "option_c": "Beta-blockers",
                "option_d": "Diuretics",
                "correct": "B",
                "explanation": "EPO increases red blood cell count, thickening blood and significantly raising stroke and heart attack risk."
            },
            {
                "question": "How many ADRVs are defined in the World Anti-Doping Code?",
                "option_a": "5",
                "option_b": "8",
                "option_c": "11",
                "option_d": "15",
                "correct": "C",
                "explanation": "The World Anti-Doping Code defines 11 distinct anti-doping rule violations."
            },
        ]
    },
]


class Command(BaseCommand):
    help = "Seed the database with anti-doping learning modules and quizzes"

    def handle(self, *args, **kwargs):
        created = 0
        skipped = 0
        for data in MODULES:
            quizzes = data.pop("quizzes")
            slug = slugify(data["title"])
            module, was_created = Module.objects.get_or_create(
                slug=slug,
                defaults=data
            )
            if was_created:
                created += 1
                self.stdout.write(f"  [CREATED] {module.title}")
                for q in quizzes:
                    Quiz.objects.create(module=module, **q)
                    self.stdout.write(f"    [QUIZ] Added question")
            else:
                skipped += 1
                self.stdout.write(f"  [SKIPPED] {module.title}")
            data["quizzes"] = quizzes  # restore for safety

        self.stdout.write(self.style.SUCCESS(
            f"\nDone! Created {created} modules, skipped {skipped}."
        ))
