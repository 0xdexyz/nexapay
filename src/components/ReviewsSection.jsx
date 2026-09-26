import { REVIEW_COLUMNS, REV_ANIM_DURATIONS } from '../data/content.js';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll.js';

function ReviewCard({ review, ariaHidden }){
  return (
    <li className="rev-card" aria-hidden={ariaHidden || undefined}>
      <p>&quot;{review.quote}&quot;</p>
      <div className="rev-foot">
        <div className={'rev-avatar' + (review.alt ? ' alt' : '')}>{review.initials}</div>
        <div>
          <div className="rev-name">{review.name}</div>
          <div className="rev-role">{review.role}</div>
        </div>
      </div>
    </li>
  );
}

export default function ReviewsSection(){
  const sectionRef = useRevealOnScroll({ threshold: 0.15 });

  return (
    <section className="rev" id="reviews" aria-labelledby="revHeading" ref={sectionRef}>
      <div className="rev-head reveal-fade">
        <div className="badge">✦ Reviews</div>
        <h2 id="revHeading">Built for the <em>crypto-native</em></h2>
        <p>See how people are using a wallet-first card experience to bring crypto closer to everyday spending.</p>
      </div>

      <div className="rev-columns" role="region" aria-label="Scrolling reviews">
        {REVIEW_COLUMNS.map((column, colIdx) => (
          <div className="rev-col" key={colIdx}>
            <ul style={{ animationDuration: REV_ANIM_DURATIONS[colIdx] }}>
              {column.map((review) => <ReviewCard key={review.name} review={review} />)}
              {column.map((review) => <ReviewCard key={review.name + '-dup'} review={review} ariaHidden />)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
